const { MongoClient, ObjectId } = require('mongodb');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const url = 'mongodb://localhost:27017';
const dbName = 'microblogging';

(async () => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB!');
    const db = client.db(dbName);

    const users = new User(db);
    const posts = new Post(db);
    const comments = new Comment(db);

    // Criar usuário
    const user = await users.create('João', 'joao@email.com', 'senha123');
    console.log('Usuário criado:', user.insertedId);

    // Criar post
    const post = await posts.create('Meu primeiro post', 'Este é o conteúdo.', 'João');
    console.log('Post criado:', post.insertedId);

    // Criar comentário
    const comment = await comments.create(post.insertedId.toString(), 'Muito bom!', 'Maria');
    console.log('Comentário criado:', comment.insertedId);

    // Buscar comentários por post
    const postComments = await comments.findByPostId(post.insertedId.toString());
    console.log('Comentários:', postComments);

    // Atualizar post
    await posts.update(post.insertedId.toString(), { title: 'Post Atualizado' });

    // Deletar comentário
    await comments.delete(comment.insertedId.toString());

  } catch (err) {
    console.error('Erro geral:', err.message);
  } finally {
    await client.close();
  }
})();
