
class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async create(name, email) {
    if (!name || !email) throw new Error('Nome e email são obrigatórios!');
    return await this.collection.insertOne({ name, email, createdAt: new Date() });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }
}

module.exports = User;
