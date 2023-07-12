import React, { useState, useEffect, useContext } from 'react';
import './Nutrition.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

import LifeTrackerAPIClient from '../../api/apiclient.js';

function Nutrition() {

  const { authenticatedUserState } = useContext(AuthenticatedUserContext);

  const apiClient = new LifeTrackerAPIClient();

  const [nutritionStatus, setNutritionStatus] = useState(null);
  const [nutritionList, setNutritionList] = useState(null);

  // useEffect to populate nutrition grid

  useEffect(() => { 
    async function callPopulate() {
      populateNutritionGrid();
    }
    callPopulate();
  }, []);

  // GET request

  async function getNutritionList() {
    const apiRoute = '/nutrition/fetchAllItems';
    const response = await apiClient.get(apiRoute, {}, {});
    return response;
  }

  async function populateNutritionGrid() {
    const allItemsResponse = await getNutritionList();
    const allItemsObject = allItemsResponse.body.itemsObject;
    setNutritionList(allItemsObject); 
  }

  // POST request
  
  function processFormData(formData) {
    const formValues = Object.fromEntries(formData.entries());
    const authenticatedUserId = authenticatedUserState.id;
    const wrappedFormValues = { itemObj: { ...formValues, user_id: authenticatedUserId } };
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
    try {
      const formData = new FormData(event.target);
      const wrappedFormObj = processFormData(formData);
      const response = await postNutrition(wrappedFormObj);
      handleNutritionStatus(response);
      await populateNutritionGrid();
    } catch (err) {
      setNutritionStatus('Error has occured.');
    }
  }

  return (
    <div className="nutrition">
        <h3>Insert name, category, and the calories of your diet today !</h3>
        <form className="nutrition__form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" required/>
            <input type="text" name="category" placeholder="Category" required/>
            <input type="number" name="calories" placeholder="Calories" required/>
            <button type="submit">Add Item</button>
        </form>
        { (nutritionStatus) ? <h3>{nutritionStatus}</h3> : <></> }
        <div className="nutrition__grid">
            { 
            (nutritionList) ?
              ( nutritionList.map((item) => (
                <div key={item.id} className="nutrition__item">
                    <h3>{item.name}</h3>
                    <p>Category: {item.category}</p>
                    <p>Calories: {item.calories}</p>
                    <p>Date: {item.created_at}</p>
                </div>
                ))
              ) : (
                <h3>Loading...</h3>
              )
            }
        </div>
    </div>
  );
}

export default Nutrition;

