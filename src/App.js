import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Webcam from './react-webcam';

const style = {
  webcamWrapper: {
    width: '100%',
  }
}

function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}


class App extends Component {
  constructor() {
    super()
    this.state = {
      imageSrc: ""
    }
  }
  
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  getImageRecognitionData(image) {

    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/png');                
    var data = new FormData();
    var field = {
      uri: image,
      name:'he.png',
      type: 'image/png'
    }
    data.append('images_file', image);

    var data = new FormData();

    fetch(image)
    .then(res => res.blob())
    .then(blob => {
      data.append('image', blob, 'filename.png')
      

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      };

      const apiKey = "621280fd2b3f5d4ffcf98dc31920ccecd1b79d7c"
      const url = `https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=${apiKey}&version=2016-05-20`
      return axios.post(url, data, config)
    }).then(res => {
        let result = res.data.images[0].classifiers[0]
        this.setState({result})
        console.log(result)
    }).catch(res => {
        console.log("tutu")
    })





      // data.append("images_file", {
      //   // uri: "https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjHu9ilgd_WAhXDQ48KHZErCIgQjRwIBw&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fjson_file_system&psig=AOvVaw0xqPgt5GawDhfJVhsvnq71&ust=1507482827747752",
      //   uri: "http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg",  
      //   name: "o.jpg",
      //   type: 'image/jpeg',
      // });

      // data.append("images_file", {
      //   uri: image, name: 'hello.jpeg', type: 'image/jpeg'}, 'hello.jpeg');

      // Create the config object for the POST
      // You typically have an OAuth2 token that you use for authentication
      
  }
 
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({imageSrc: imageSrc})
    this.getImageRecognitionData(imageSrc)
  };
 
  render() {
    const { result } = this.state
    console.log(this.state.default)
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/png"
          width={350}
        />
        <button onClick={this.capture}>Capture photo</button>
        <img src="this.state.imageSrc" alt=""/>
        {this.state.imageSrc? <img src={this.state.imageSrc} alt="camera shot"/> : ""}
        { JSON.stringify(result || {}, 0, 4) }
      </div>
    );
  }
}

export default App;
