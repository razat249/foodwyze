import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Camera extends Component {

  componentWillMount() {
    const { audio } = this.props;
    let video = {facingMode : { ideal: 'environment' }}
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video , audio })
      .then((mediaStream) => {
        this.setState({ mediaStream });
        this.video.srcObject = mediaStream;
        this.video.play();
      })
      .catch(error => error);
    }
  }

  capture() {
    const mediaStreamTrack = this.state.mediaStream.getVideoTracks()[0];
    const imageCapture = new window.ImageCapture(mediaStreamTrack);

    return imageCapture.takePhoto();
  }

  render() {
    return (
      <div style={this.props.style}>
        { this.props.children }
        <video className="webcam" height={this.props.height} width={this.props.width} ref={(video) => { this.video = video; }} />
      </div>
    );
  }
}

Camera.propTypes = {
  audio: PropTypes.bool,
  video: PropTypes.bool,
  children: PropTypes.element,
  style: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

Camera.defaultProps = {
  audio: false,
  video: true,
  style: {},
  children: null
};

export default Camera;
