
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Webcam from './react-webcam';
import {base64ToBlob} from './utils'
import './styles.css';
import NutritionInfo from './NutritionInfo';
// import sound from "./song.mp3"

const style = {
  webcamWrapper: {
    width: "100%"
  }
};

const backgroundVolume = -8;

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageSrc: "",
      nutrients: {
        data: {},
        fetching: false,
        error: ""
      },
      food: {
        data: {
          food_name: "",
          nf_calories:278.4,
          nf_cholesterol:0,
          nf_dietary_fiber:5.52,
          nf_p:67.2,
          nf_potassium:1116,
          nf_protein:1.9,
          nf_saturated_fat:0.17,
          nf_sodium:12,
          nf_sugars:33.6,
          nf_total_carbohydrate:74.76,
          nf_total_fat:0.43,
        },
        fetching: false,
        error: ""
      },
      fetched: false
    };
  }

  setRef = cam => {
    this.camera = cam;
  };

  getNutritionData(food) {
    console.log(food);
    return axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        query: `${food}`,
        timezone: "US/Eastern"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-app-id": "003c8ea9",
          "x-app-key": "4cf01cb7d2c5ac13741fd793a09d760c"
        }
      }
    );
  }

  getImageRecognitionData(image) {
    var data = new FormData();

    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        data.append("image", image, "filename.png");

        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        const apiKey = "621280fd2b3f5d4ffcf98dc31920ccecd1b79d7c";
        const url = `https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=${apiKey}&version=2016-05-20`;
        this.setState({ food: { ...this.state.food, fetching: true }, fetched: false });
        return axios.post(url, data, config);
      })
      .then(res => {
        let result = res.data.images[0].classifiers[0].classes[0].class;
        this.setState({
          food: { ...this.state.food, data: result, fetching: false },
        });
        return this.getNutritionData(result);
      })
      .then(data => {
        let foodInfo = data.data.foods[0]
        this.setState({
          nutrients: {
            ...this.state.nutrients,
            data: {
                food_name: foodInfo.food_name,
                nf_calories: foodInfo.nf_calories,
                nf_cholesterol: foodInfo.nf_cholesterol,
                nf_dietary_fiber: foodInfo.nf_dietary_fiber,
                nf_p: foodInfo.nf_p,
                nf_potassium: foodInfo.nf_potassium,
                nf_protein: foodInfo.nf_protein,
                nf_saturated_fat: foodInfo.nf_saturated_fat,
                nf_sodium: foodInfo.nf_sodium,
                nf_sugars: foodInfo.nf_sugars,
                nf_total_carbohydrate: foodInfo.nf_total_carbohydrate,
                nf_total_fat: foodInfo.nf_total_fat,
              },
            fetching: false
          },
          fetched: true
        });
      })
      .catch(res => {
        this.setState({
          food: {
            ...this.state.food,
            error: res.response.message,
            fetching: false
          }
        });
        this.setState({
          nutrients: {
            ...this.state.nutrients,
            error: res.response.message,
            fetching: false
          }
        });
        console.error(res);
      });
  }

  capture = () => {
    this.camera.capture().then(blob => {
      let src = URL.createObjectURL(blob);
      this.setState({ imageSrc: src });
      this.getImageRecognitionData(blob);
    }
    )
  };

  render() {
    const { result, nutrients, food, fetched } = this.state;
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <section className="app-container">
            {/* <NutritionInfo nutrients={this.state.nutrients.data} ></NutritionInfo>   */}
         {/* <audio loop autoPlay>
          <source src={sound} type="audio/mpeg" />
        </audio>  */}
        <Webcam
          className="webcam"
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/png"
          height={height}
          width={width}
        /> 
        {food.fetching || nutrients.fetching?  <img className="captured-image" height={height}
          width={width} src={this.state.imageSrc} alt=""/> : null }
        <button className="btn-capture" onClick={this.capture}> </button>
           {fetched ? <NutritionInfo nutrients={this.state.nutrients.data}></NutritionInfo> : ""}
      </section>
    );
  }
}

export default App;
