import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Webcam from './react-webcam';
import {base64ToBlob} from './utils'
import './styles.css';
import NutritionInfo from './NutritionInfo';

const style = {
  webcamWrapper: {
    width: '100%',
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      imageSrc: "",
      nutrients: {
        data:{},
        fetching: false,
        error: "",
      },
      food: {
        data:{},
        fetching: false,
        error: "",
      }
    }
  }
  
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  getNutritionData(food) {
    console.log(food)
    return axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      "query": `${food}`,
      "timezone": "US/Eastern"
      },
      { 
        headers:{
        'Content-Type':'application/json',
        'x-app-id':'003c8ea9',
        'x-app-key':'4cf01cb7d2c5ac13741fd793a09d760c',
    }})
  }

  getImageRecognitionData(image) {
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
      this.setState({ food: {...this.state.food, fetching: true} })
      return axios.post(url, data, config)
    }).then(res => {
        let result = res.data.images[0].classifiers[0].classes[0].class
        this.setState({ food: {...this.state.food, data: result, fetching: false} })
        this.setState({ nutrients: {...this.state.nutrients, fetching: false} })      
        return this.getNutritionData(result)
    }).then(data => {
        this.setState({ nutrients: {...this.state.nutrients, data: data.data.foods[0], fetching: false} })
        console.log(data.data)
    }).catch(res => {
        this.setState({ food: {...this.state.food, error: res.response.message, fetching: false} })
        this.setState({nutrients: {...this.state.nutrients, error: res.response.message, fetching: false}})
        console.error(res)
    })
  }
 
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({imageSrc: imageSrc})
    this.getImageRecognitionData(imageSrc)
  };
 
  render() {
    const { result, nutrients, food } = this.state
    const width = window.innerWidth
    const height = window.innerHeight
    return (
      <section className="app-container">
        <NutritionInfo></NutritionInfo>
        {/* <Webcam
          className="webcam"
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/png"
          height={height} 
          width={width}
        /> */}
        {food.fetching || nutrients.fetching?  <img className="captured-image" src={this.state.imageSrc} alt=""/> : null }
        <button className="btn-capture" onClick={this.capture}> </button>

         {/* {food.fetching || nutrients.fetching? "Loading..." : <h1>{JSON.stringify(nutrients.data)}</h1>}  */}
      </section>
    );
  }
}

export default App;
