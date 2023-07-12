const dbClientInstance = require('../database/db.js');
const { BadRequestError } = require('../utils/errors.js');

class Nutrition {
  // -----Model Methods----- 
 
  static async fetchAllItems(reqObj) {
    const allItems = await this.getAllItems(reqObj.userId);
    return allItems;
  }

  static async addItem(reqObj) {
    const result = await this.postItem(reqObj);
    return result;
  }

  // --Database Queries--

  static async getAllItems(userId) {
    const query = 'SELECT id, name, category, calories, created_at FROM NutritionTable WHERE user_id=$1;';
    const result = await dbClientInstance.query(query, [userId]);
    return result;
  }

  static async postItem(reqObj) {
    const { name, category, calories, user_id } = reqObj;
    const query = 'INSERT INTO NutritionTable (name, category, calories, user_id) VALUES ($1, $2, $3, $4);'
    const result = await dbClientInstance.query(query, [name, category, calories, user_id]);
    return result;
  }

}

module.exports = Nutrition;
