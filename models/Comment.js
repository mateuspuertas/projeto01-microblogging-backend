const logger = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Comment {
  constructor(db) {
    this.collection = db.collection('comments');
  }

  async create(postId, content, author) {
    try {
      if (!postId || !content || !author) throw new Error('Post ID, conteúdo e autor são obrigatórios!');
      return await this.collection.insertOne({ postId, content, author, createdAt: new Date() });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async findByPostId(postId) {
    try {
      return await this.collection.find({ postId }).toArray();
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async update(commentId, data) {
    try {
      return await this.collection.updateOne({ _id: new ObjectId(commentId) }, { $set: data });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async delete(commentId) {
    try {
      return await this.collection.deleteOne({ _id: new ObjectId(commentId) });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}

module.exports = Comment;
