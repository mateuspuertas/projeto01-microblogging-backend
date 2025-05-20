class Post {
  constructor(db) {
    this.collection = db.collection('posts');
  }

  async create(title, content, author) {
    if (!title || !content || !author) throw new Error('Campos obrigatórios faltando!');
    return await this.collection.insertOne({ title, content, author, createdAt: new Date() });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }
}

module.exports = Post;
