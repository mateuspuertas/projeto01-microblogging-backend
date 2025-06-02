const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async create(name, email, password) {
    try {
      if (!name || !email || !password) throw new Error('Nome, email e senha são obrigatórios!');
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.collection.insertOne({ name, email, password: hashedPassword, createdAt: new Date() });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async update(userId, data) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      return await this.collection.updateOne({ _id: userId }, { $set: data });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async delete(userId) {
    try {
      return await this.collection.deleteOne({ _id: userId });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}

module.exports = User;
