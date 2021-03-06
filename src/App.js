import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import Webcam from "./react-webcam";
import { base64ToBlob } from "./utils";
import sound from "./song.mp3"
import randomColor from "random-color"
import "./styles.css";
import 'antd/dist/antd.css';
import NutritionInfo from './NutritionInfo';
import { Icon, Progress } from "antd"



// 60*136/1000
const pulse = 200

const loadingQuote = {
  padding: "30px",
  backgroundColor: "black",
  color: "white",
  position: "absolute",
  top: "35vh",
  left: "12vh",
  zIndex: 1000
}

const style = {
  webcamWrapper: {
    width: "100%"
  }
};

const responsiveVoice = window.responsiveVoice

const backgroundVolume = -20;

class App extends Component {
  constructor() {
    super();
    this.initialState = {
      imageSrc: "",
      nutrients: {
        data: {},
        fetching: false,
        error: ""
      },
      food: {
        data: {
          food_name: "",
          serving_weight_grams: 0,
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
      color: "transparent",
      scale: 1,
      fetched: false,
      info: false,
    };
    this.state = this.initialState;
    this.setInitialState = this.setInitialState.bind(this)
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
          "x-app-id": "f275bd75",
          "x-app-key": "8658967c4d3cdbe4bf77e08a48b61393"
        }
      }
    );
  }

  aggregateFoodData()  {
    const foodObjects = JSON.parse(localStorage.items || '[]') || []
    return foodObjects.reduce((acc, obj) => {
      Object.keys(obj).map(key => {
        if( !acc[key] ) acc[key] = 0;
        acc[key] += (obj[key] || 0)
      })
      return acc;
    }, {})
  }

  getImageRecognitionData(image) {
    var data = new FormData();
    let result

    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        data.append("image", image, "filename.png");

        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        const apiKey = "a5508ae32e72726480a957a08d5953d0fccdf628";
        const url = `https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=${apiKey}&version=2016-05-20`;
        this.setState({ food: { ...this.state.food, fetching: true }, nutrients: {...this.state.nutrients, fetching: true}, fetched: false });
        this.colorChanger = setInterval(() => {
          this.setState({color: randomColor().hexString(), scale: this.state.scale === 1.5 ? 1 : 1.5})
        }, pulse)
        this.refs.audio.play();
        return axios.post(url, data, config);
      })
      .then(res => {
        result = res.data.images[0].classifiers[0].classes[0].class;
        this.setState({
          food: { ...this.state.food, data: result, fetching: false },
        });
        return this.getNutritionData(result);
      })
      .then(data => {
        let foodInfo = data.data.foods[0];
        console.log(foodInfo)
        const foodObject = {
            food_name: foodInfo.food_name,
            serving_weight_grams: foodInfo.serving_weight_grams,
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
        }
        this.storeFoodObject(foodObject);
        this.setState({
          nutrients: {
            ...this.state.nutrients,
            data: foodObject,
            fetching: false
          },
          fetched: true
        });
        clearInterval(this.colorChanger)
        responsiveVoice.speak(", , I have an app , I have a" + result + " that is " + data.data.foods[0].nf_calories + "calories", "Hindi Female", {rate: 0.8});
      })
      .catch(res => {
        console.log(res)
        this.setState({
          food: {
            ...this.state.food,
            error: res.response.data.message,
            fetching: false
          },
          nutrients: {
            ...this.state.nutrients,
            error: res.response.data.message,
            fetching: false
          },
          fetched: true
        });
        // setTimeout(() =>{ this.setState({
        //   nutrients: {...this.state.nutrients, error: ""},
        //   food: {...this.state.food, error: ""}
        // }) }, 2000);
        console.log('lerr', res.response.data.message);
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

  storeFoodObject(foodObject) {
    const foodObjects = JSON.parse(localStorage.items || '[]') || []
    const itemToSave = {
      food: foodObject,
      time: Date(),
    }
    foodObjects.push(itemToSave)
    localStorage.setItem('items', JSON.stringify(foodObjects) )
  }

  showError(error) {
    return error ? <div className="error">{error}</div>: null
  }

  setInitialState() {
    this.setState(this.initialState)
  }

  render() {
    const { result, nutrients, food, fetched } = this.state;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if(this.state.info) {
      return <section className="app-container" style={{ background: "#000"}}>
          
          <Icon type="bars" style={{
            fontSize: 40,
            float: "right",
            margin: 10,
            color: "#FFF",
          }} onClick={() => {
            this.setState({
              info: false
            })
          }} />
          <div style={{
            margin: 20
          }}>
          <h1 style={{ color: "#FFF"}}>Your today's total consumption</h1>
        <NutritionInfo error={this.state.nutrients.error} nutrients={this.aggregateFoodData()}></NutritionInfo>
        </div>
      </section>
    }
    return (
      <section className="app-container">
        <audio loop ref="audio" onLoadedData={(e,i) => {
            console.warn(this.refs.audio)
            this.refs.audio.volume = 0.1
          }}>
          <source src={sound} type="audio/mpeg" />
        </audio>
          <Icon type="bars" style={{
            fontSize: 40,
            float: "right",
            margin: 10,
            color: "#FFF"
          }} onClick={() => {
            this.setState({
              info: true
            })
          }} />
        <Webcam
          className="webcam"
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/png"
          height={height}
          width={width}
        />
        {food.fetching || nutrients.fetching ? (
          <div className="captured-image" style={{
            backgroundImage: "url(" + this.state.imageSrc + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundBlendMode: "screen",
            backgroundColor: this.state.color,
            transform: "scale("+ this.state.scale + ")"
            }} alt="" />
        ) : null}

        {fetched ? <NutritionInfo error={this.state.nutrients.error} nutrients={this.state.nutrients.data}></NutritionInfo> : 
        <button className="btn-capture" onClick={this.capture}>
        </button>}

        {this.state.nutrients.error || fetched ? <button className="btn-capture close-btn" onClick={this.setInitialState}>X</button> : null}

         {food.fetching || nutrients.fetching ? <div style={loadingQuote}><h1>Alright!!!!</h1></div>: null} 


        {this.showError(this.nutrients)}
      </section>
    );
  }
}

export default App;
