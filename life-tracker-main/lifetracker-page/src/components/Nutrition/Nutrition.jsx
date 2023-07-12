import React, { useState, useContext } from 'react';
import './Nutrition.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

import LifeTrackerAPIClient from '../../api/apiclient.js';

function Nutrition() {

  const { authenticatedUserState } = useContext(AuthenticatedUserContext);

  const apiClient = new LifeTrackerAPIClient();

  const [nutritionStatus, setNutritionStatus] = useState(null);
  const [nutritionList, setNutritionList] = useState(null);

  // useEffect to populate nutrition grid

  useEffect(() => populateNutritionGrid(), []);

  // GET request

  async function getNutrition() {
    const apiRoute = '/nutrition/fetchAllItems';
    const response = await apiClient.get(apiRoute, wrappedFormValues, {});
    return response;
  }

  function processItemsResponse(response) {
     
  }

  async function populateNutritionGrid() {
    const allItemsResponse = getNutrition();
    const allItemsObject = processItemsResponse(allItemsResponse);
    setNutritionList(allItemsObject); 
  }

  // POST request
  
  function processFormData(formData) {
    const formValues = Object.fromEntries(formData.entries());
    const wrappedFormValues = { credentials: formValues };
    return wrappedFormValues;
  }

  async function postNutrition(wrappedFormValues) {
    const apiRoute = '/nutrition/addItem';
    const response = await apiClient.post(apiRoute, wrappedFormValues, {});
    return response;
  }

  function handleNutritionStatus(response) {
    if (response.ok) {
      const successString = JSON.stringify(response.body.message);
      setNutritionStatus(successString);
    }
    else {
      const errorString = JSON.stringify(response.body.error.message);
      setNutritionStatus(errorString);
    }
  }
 
  async function handleSubmit() {
    event.preventDefault();
    const formData = new FormData(event.target);
    const wrappedFormObj = processFormData(formData);
    const response = await postNutrition(wrappedFormObj);
    handleNutritionStatus(response);
  }

  return (
    <div className="nutrition">
        <form className="nutrition__form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={nutritionInput.name} onChange={handleChange} />
            <input type="text" name="category" placeholder="Category" value={nutritionInput.category} onChange={handleChange} />
            <input type="number" name="calories" placeholder="Calories" value={nutritionInput.calories} onChange={handleChange} />
            <button type="submit">Add Item</button>
        </form>
        { (nutritionStatus) ? <h3>{nutritionStatus}</h3> : <></> }
        <div className="nutrition__grid">
            {nutritionList.map((item) => (
                <div key={item.id} className="nutrition__item">
                    <h3>{item.name}</h3>
                    <p>Category: {item.category}</p>
                    <p>Calories: {item.calories}</p>
                    <p>Date: {item.date}</p>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Nutrition;

