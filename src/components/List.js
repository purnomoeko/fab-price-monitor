import React from 'react';
import ReactTable from 'react-table';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import { APIURL } from '../variable';
import Header from './Header';
import Images from './Images';



class ProductList extends React.Component {

    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            selectedImage: { gallery: {} },
            modalShown: false,
        };
        this.getProductList = this.getProductList.bind(this);
        this.renderListing = this.renderListing.bind(this);
        this.onRouteChanged = this.onRouteChanged.bind(this);
    }

    async componentWillMount() {
        await this.getProductList();
        const { data } = this.state;
        const { location } = this.props;
        const splitedLocation = location.pathname.split('/');
        if (splitedLocation.length > 3) {
            const records = data.filter(obj => obj._id === splitedLocation[3]);
            if (records.length > 0) this.setState({ modalShown: true, selectedImage: records[0].images });
            else this.props.history.push('/list');
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        const { location } = this.props;
        const { data } = this.state;
        const splitedLocation = location.pathname.split('/');
        if (splitedLocation.length > 3) {
            const records = data.filter(obj => obj._id === splitedLocation[3]);
            if (records.length > 0) this.setState({ modalShown: true, selectedImage: records[0].images });
            else this.props.history.push('/list');
        } else {
            this.setState({ modalShown: false });
        }
    }

    async getProductList() {
        this.setState({ loading: true });
        const productList = await fetch(`${APIURL}product/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'get',
        }).then(res => res.json());

        this.setState({ data: productList.records, loading: false });
    }

    renderListing() {
        const columns = [{
            Header: 'Product Name',
            accessor: 'title',
        }, {
            Header: 'Price',
            id: 'price',
            accessor: d => d.price.toLocaleString(),
        }, {
            Header: 'Actions',
            accessor: '_id',
            Cell: props => (
                <div className="btn-group" role="group">
                    <Link to={`/list/images/${props.row._id}`} className="btn btn-default">
                        <i className="fa fa-camera" />
                        &nbsp;Images
                    </Link>
                    <Link to={`/details/${props.value}`} className="btn btn-info">
                        <i className="fa fa-eye" />
                        &nbsp;Details
                    </Link>
                    <a href={props.row._original.link} className="btn btn-warning" rel="noopener noreferre" target="_blank">
                        fabelio.com
                    </a>

                </div>
            ),
        }];

        const { loading, data } = this.state;
        return (
            <div className="" id="productList">
                {loading ? <i className="fa fa-spinner fa-spin" style={{ fontSize: 24 }} /> : null}
                <ReactTable
                    columns={columns}
                    data={data}
                />
            </div>
        );
    }

    render() {
        const List = this.renderListing();
        return [
            <Header key="header" />,
            List,
            <Images key="image" selectedImage={this.state.selectedImage} visible={this.state.modalShown} />,
        ];
    }
}

ProductList.propTypes = {
    location: propTypes.object.isRequired,
}

export default ProductList;