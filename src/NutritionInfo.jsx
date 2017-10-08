import React, { Component } from 'react';

export default class NutritionInfo extends Component {
  constructor() {
    super()
  }

  render() {

    const {
        food_name,
        serving_weight_grams,
        nf_calories,
        nf_cholesterol,
        nf_dietary_fiber,
        nf_p,
        nf_potassium,
        nf_protein,
        nf_saturated_fat,
        nf_sodium,
        nf_sugars,
        nf_total_carbohydrate,
        nf_total_fat
      } = this.props.nutrients


    let rendering;
    if (!this.props.error) {
      rendering = <div>
        <h2>{food_name}</h2>
        <hr/>
        <div className="nutritions-content"><h3>Amount Per Serving <span style={{textAlign: "right"}}>{serving_weight_grams}</span></h3></div>
        <hr/>
        <div>Calories {nf_calories} Kcal</div>
        <hr/>
        <div className="nutritions-content">
          <div><b> Total Fat: </b><span>{nf_total_fat} grams</span></div>
          <div><b> Saturated Fat: </b><span>{nf_saturated_fat} grams</span></div>
          <div><b> Cholesterol: </b><span>{nf_cholesterol} milligrams</span></div>
          <div><b> Sodium: </b><span>{nf_sodium} milligrams </span></div>
          <div><b> Potassium: </b><span>{nf_potassium} milligrams </span></div>
          <div><b> Total  Carbohydrate:s</b><span>{nf_total_carbohydrate} grams </span></div>
          <div><b> Dietary  Fibe:r</b><span>{nf_dietary_fiber} grams</span></div>
          <div><b> Sugars: </b><span>{nf_sugars} grams</span></div>
          <div><b> Protein: </b><span>{nf_protein}gz</span></div>
        </div>
      </div>
    } else {
      rendering = <div style={{marginTop: "40vh", color: "white !important"}}><h3 style={{ color: "white"}}>I can't see any food. Let's try again :)</h3></div>
    }
      return ( 
        <div className="nutrition-info">
          {rendering}

      </div>)
  }
}

