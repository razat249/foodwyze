import React, { Component } from 'react';

export default class NutritionInfo extends Component {
  constructor() {
    super()
  }

  render() {

    const {
        food_name,
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
        <h3>Nutrition Facts ({food_name}) </h3>
        <hr/>
        <div>Amount Per Serving</div>
        <div>Calories 401</div>
        <hr/>
        <div>% Daily Value*</div>
        <div>
            <ul>
              Total Fat {nf_calories} grams
                  <li>Saturated Fat {nf_saturated_fat} grams</li>
                  {/* <li>Polyunsaturated Fat {pol} grams</li>
                  <li>Monounsaturated Fat 11g</li> */}
            </ul>
        </div>

          <div><b> Cholesterol: </b> <span>{nf_cholesterol} milligrams</span></div>
          <div><b> Sodium: </b> <span>{nf_sodium} milligrams </span></div>
          <div><b> Potassium: </b> <span>{nf_potassium} milligrams </span></div>
          <div><b> Total  Carbohydrate:s</b> <span>{nf_total_carbohydrate} grams </span></div>
          <div><b> Dietary  Fibe:r</b> <span>{nf_dietary_fiber} grams</span></div>
          <div><b> Sugars: </b> <span>{nf_sugars} grams</span></div>
          <div><b> Protein: </b> <span>{nf_protein}gz</span></div>
      </div>
    } else {
      rendering = <div style={{marginTop: "40vh"}}><h3>I can't see any food. Let's try again :)</h3></div>
    }
      return ( 
        <div className="nutrition-info">
          {rendering}

      </div>)
  }
}

