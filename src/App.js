import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import Webcam from "./react-webcam";
import { base64ToBlob } from "./utils";
import sound from "./song.mp3"
import randomColor from "random-color"
import "./styles.css";
import NutritionInfo from './NutritionInfo';



// 60*136/1000
const pulse = 200

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
    this.state = {
      imageSrc: "",
      nutrients: {
        data: {},
        fetching: false,
        error: ""
      },
      food: {
        data: {},
        fetching: false,
        error: ""
      },
      color: "transparent",
      scale: 1
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

        const apiKey = "621280fd2b3f5d4ffcf98dc31920ccecd1b79d7c";
        const url = `https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=${apiKey}&version=2016-05-20`;
        this.setState({ food: { ...this.state.food, fetching: true } });
        this.colorChanger = setInterval(() => {
          this.setState({color: randomColor().hexString(), scale: this.state.scale === 1.5 ? 1 : 1.5})
        }, pulse)
        this.refs.audio.play()
        return axios.post(url, data, config);
      })
      .then(res => {
        result = res.data.images[0].classifiers[0].classes[0].class;
        this.setState({
          food: { ...this.state.food, data: result, fetching: false }
        });
        this.setState({
          nutrients: { ...this.state.nutrients, fetching: false }
        });
        return this.getNutritionData(result);
      })
      .then(data => {
        this.setState({
          nutrients: {
            ...this.state.nutrients,
            data: data.data.foods[0],
            fetching: false
          }
        });
        clearInterval(this.colorChanger)
        responsiveVoice.speak(", , I have an app , I have a" + result + " that is " + data.data.foods[0].nf_calories + "calories", "Hindi Female", {rate: 0.8});
      })
      .catch(res => {
        this.setState({
          food: {
            ...this.state.food,
            error: res.response.data.message,
            fetching: false
          }
        });
        this.setState({
          nutrients: {
            ...this.state.nutrients,
            error: res.response.data.message,
            fetching: false
          }
        });
        setTimeout(() =>{ this.setState({
          nutrients: {...this.state.nutrients, error: ""},
          food: {...this.state.food, error: ""}
        }) }, 2000);
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

  showError(error) {
    return error ? <div className="error">{error}</div>: null
  }

  render() {
    const { result, nutrients, food } = this.state;
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
      <section className="app-container">
        <audio loop ref="audio" onLoadedData={(e,i) => {
            console.warn(this.refs.audio)
            this.refs.audio.volume = 0.1
          }}>
          <source src={sound} type="audio/mpeg" />
        </audio>
         <NutritionInfo></NutritionInfo> 
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
        <button className="btn-capture" onClick={this.capture}>
          {" "}
        </button>

        {food.fetching || nutrients.fetching ? (
          "Loading..."
        ) : (
          <h1>{JSON.stringify(nutrients.data)}</h1>
        )}

        {this.showError(this.nutrients)}
      </section>
    );
  }
}

export default App;
