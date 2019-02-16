import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const ImageSlideShow = (props) => {
    console.info(props);
    if (Object.keys(props.selectedImage.gallery).length === 0) return null;
    return (
        <div id="myModal" className="modal modal-lg modal-backdrop" tabIndex="-2" role="dialog" style={{ display: props.visible ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Images</h4>
                    </div>
                    <div className="modal-body">
                        <Carousel>
                            {Object.keys(props.selectedImage.gallery).map(index => (
                                <div>
                                    <img src={props.selectedImage.gallery[index].large} alt={index} />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <div className="modal-footer">
                        <Link to="/list" type="button" className="btn btn-default" data-dismiss="modal">Close</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

ImageSlideShow.propTypes = {
    visible: PropTypes.bool,
    selectedImage: PropTypes.object,
};

ImageSlideShow.defaultProps = {
    visible: true,
    selectedImage: {
        gallery: {},
    },
};

export default ImageSlideShow;