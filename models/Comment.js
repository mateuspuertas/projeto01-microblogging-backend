class Comment {
  constructor(db) {
    this.collection = db.collection('comments');
  }

  async create(postId, content, author) {
    if (!postId || !content || !author) throw new Error('Post ID, conteúdo e autor são obrigatórios!');
    return await this.collection.insertOne({ postId, content, author, createdAt: new Date() });
  }

  async findByPostId(postId) {
    return await this.collection.find({ postId }).toArray();
  }
}

module.exports = Comment;
