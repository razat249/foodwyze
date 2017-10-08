import React, { Component } from 'react';

export default class NutritionInfo extends Component {
  constructor() {
    super()
  }

  render() {
      return <div className="nutrition-info">
          <h3>Nutrition Facts</h3>
          <hr/>
          <div>Amount Per Serving</div>
          <div>Calories 401</div>
          <hr/>
          <div>% Daily Value*</div>
          <div>
              <ul>
                Total Fat 28g -- 43 %
                    <li>Saturated Fat 12g grams</li>
                    <li>Polyunsaturated Fat 2g grams</li>
                    <li>Monounsaturated Fat 11g</li>
              </ul>
          </div>

<div>Cholesterol 69mg milligrams23%</div>
<div>Sodium 548mg milligrams 23%</div>
<div>Potassium 113mg milligrams 11%</div>
<div>Total Carbohydrates 32g grams 2% </div>
<div>Dietary Fiber 0.5g grams 2%</div>
<div>Sugars 27g grams</div>
<div>Protein 6.9gz</div>

      </div>
  }
}

