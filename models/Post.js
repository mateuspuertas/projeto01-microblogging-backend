const logger = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Post {
  constructor(db) {
    this.collection = db.collection('posts');
  }

  async create(title, content, author) {
    try {
      if (!title || !content || !author) throw new Error('Campos obrigatórios faltando!');
      return await this.collection.insertOne({ title, content, author, createdAt: new Date() });
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

  async update(postId, data) {
    try {
      return await this.collection.updateOne({ _id: new ObjectId(postId) }, { $set: data });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async delete(postId) {
    try {
      return await this.collection.deleteOne({ _id: new ObjectId(postId) });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}

module.exports = Post;
