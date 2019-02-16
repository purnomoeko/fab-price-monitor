import React from 'react';
import PropTypes from 'prop-types';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Header from './Header';
import { APIURL } from '../variable';
import { refreshUuid } from './actions';

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            productDetail: null,
            comments: [],
            commentText: '',
            loading: false,
        };
        this.getProductDetail = this.getProductDetail.bind(this);
        this.addComment = this.addComment.bind(this);
        this.addVote = this.addVote.bind(this);
    }

    componentWillMount() {
        this.getProductDetail();
        if (this.props.userId === null) {
            this.props.refreshUuid();
        }
    }

    async getProductDetail() {
        const { id } = this.props.match.params;
        const requests = [];
        requests.push(
            fetch(`${APIURL}product/one/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json()),
            fetch(`${APIURL}product/${id}/comments`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json()),
        );
        const responses = await Promise.all(requests);
        this.setState({ productDetail: responses[0].product, comments: responses[1].records });
    }

    async addComment() {
        const { commentText, loading, comments } = this.state;
        if (loading) return;
        if (commentText.length < 3) return;
        this.setState({ loading: true });
        const { id } = this.props.match.params;
        const response = await fetch(`${APIURL}product/${id}/comments`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify({
                uuid: this.props.userId,
                comment: this.state.commentText,
            }),
        }).then(res => res.json());
        comments.push(response.comment);
        this.setState({ loading: false, comments, commentText: '' });
    }

    async addVote(type = 'upvote', commentId) {
        const { loading, comments } = this.state;
        if (loading) return;
        this.setState({ loading: true });
        const response = await fetch(`${APIURL}product/comments/${commentId}/votes`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify({
                uuid: this.props.userId,
                type,
            }),
        }).then(res => res.json());
        Object.keys(comments).forEach((index) => {
            if (comments[index]._id === response.comment._id) comments[index] = response.comment;
        });
        this.setState({ loading: false, comments, commentText: '' });
    }

    render() {
        const { productDetail, comments, commentText, loading } = this.state;
        let renderer = <i className="fa fa-spinner fa-spin" style={{ fontSize: 35 }} />;
        if (productDetail !== null) {
            renderer = (
                <div className="product-detail" key="renderer" style={{ padding: 30 }}>
                    <h1>
                        {productDetail.title}
                        &nbsp;- Rp.&nbsp;
                        {productDetail.price.toLocaleString()}
                    </h1>
                    <div className="col-lg-8 col-xs-12 col-sm-12 col-md-8">
                        <Carousel>
                            <div>
                                <img src={productDetail.images.large} alt="large" />
                            </div>
                            {Object.keys(productDetail.images.gallery).map(index => (
                                <div>
                                    <img src={productDetail.images.gallery[index].large} alt={index} />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <h3>
                            Comments
                            <br />
                            <span style={{ fontSize: 12 }}>
                                Your user id:
                                {this.props.userId.substr(24)}
                                &nbsp;
                            </span>
                            <button disabled={loading} className="btn-xs btn-warning" type="button" onClick={this.props.refreshUuid}>
                                <i className="fa fa-refresh" />
                            </button>
                        </h3>
                        <div className="comment-space">
                            {comments.map(comment => (
                                <div className="section">
                                    <p className="text">
                                        <span className="username">{comment.uuid.substr(24)}</span>
                                        {comment.comment}
                                        <br />
                                    </p>
                                    <div className="votes">
                                        <span className="time">{moment(comment.createdAt).fromNow()}</span>
                                        <div className="pull-right">
                                            <button className="btn btn-xs btn-default" type="button" onClick={() => this.addVote('upvote', comment._id)}>
                                                {comment.upVoteCount}
                                                &nbsp;
                                                <i className="fa fa-thumbs-up" />
                                            </button>
                                            &nbsp;&nbsp;
                                            <button className="btn btn-xs btn-default" type="button" onClick={() => this.addVote('downvote', comment._id)}>
                                                {comment.downVoteCount}
                                                &nbsp;
                                                <i className="fa fa-thumbs-down" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            ))}
                        </div>
                        <input type="text" className="form-control" value={commentText} onChange={e => this.setState({ commentText: e.target.value })} />
                        <div className="pull-right">
                            <button disabled={loading} onClick={this.addComment} type="button" className="btn btn-primary" style={{ textAlign: 'right' }}>Comment</button>
                        </div>
                        <div className="clearfix" />
                    </div>
                    <div className="price-history col-xs-12 col-lg-4">
                        <table className="table table-stripped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Scanned Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productDetail.productsHistory.map(obj => (
                                    <tr>
                                        <td>{obj.title}</td>
                                        <td>Rp. {obj.price.toLocaleString()}</td>
                                        <td>{moment(obj.updatedAt).fromNow()}</td>
                                    </tr>
                                ))}
                              
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        return [
            <Header />,
            renderer,
        ];
    }
}

Details.propTypes = {
    userId: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        refreshUuid,
    }, dispatch)
);

const mapStateToProps = state => ({
    userId: state.product.userId,
});


export default connect(mapStateToProps, mapDispatchToProps)(Details);
