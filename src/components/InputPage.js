import React from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import Header from './Header';
import { APIURL } from '../variable';

class InputPage extends React.Component {
    constructor() {
        super();
        this.state = {
            pageLink: '',
            errorMessage: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangePageLink = this.onChangePageLink.bind(this);
    }

    componentWillMount() {

    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true });
        const { pageLink } = this.state;
        const regexUrlFabelio = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;
        if (regexUrlFabelio.test(pageLink) === false) {
            this.setState({ errorMessage: 'Page link is not valid', loading: false });
            return;
        }
        const response = await fetch(`${APIURL}product/create`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ url: pageLink }),
        }).then(res => res.json());
        this.setState({ loading: false, pageLink: '', errorMessage: null });
        if (response.result) {
            swal.fire({
                title: 'Data saved',
                html: `The product from fabelio with id ${response.result.productId} successfully saved`,
            });
        }
    }

    onChangePageLink(e) {
        e.preventDefault();
        const regexUrlFabelio = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;
        if (regexUrlFabelio.test(this.state.pageLink) === false) {
            this.setState({ errorMessage: 'Page link is not valid' });
        } else {
            this.setState({ errorMessage: null });
        }
        this.setState({ pageLink: e.target.value });
    }

    render() {
        const { errorMessage, pageLink } = this.state;
        
        return [
            <Header />,
            <div id="inputPage" key={2}>
                <form action="/" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label for="email">Product Link</label>
                        <input value={pageLink} type="text" className="form-control" id="productLink" name="productlink" onChange={this.onChangePageLink} />
                        {errorMessage ? <p style={{ color: '#ff0000' }}>{errorMessage}</p> : null }
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={this.state.loading}>Submit</button>
                </form>
            </div>,
        ];
    }
}

InputPage.propTypes = {

};

export default InputPage;
