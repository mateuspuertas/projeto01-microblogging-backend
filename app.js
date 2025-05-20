const express = require('express');
const { MongoClient } = require('mongodb');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' }),
  ],
});

const app = express();
app.use(express.json());


const url = 'mongodb://localhost:27017';
const dbName = 'microblogging';


const Post = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment');

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    logger.error('Erro ao conectar ao MongoDB:', err);
    return;
  }
  console.log('Conectado ao MongoDB!');
  const db = client.db(dbName);

  
  const posts = new Post(db);
  const users = new User(db);
  const comments = new Comment(db);

  
  app.post('/users', async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) throw new Error('Nome e email são obrigatórios!');
      await users.create(name, email);
      res.status(201).send('Usuário criado com sucesso!');
    } catch (error) {
      logger.error(error);
      res.status(400).send(error.message);
    }
  });

  app.get('/users', async (req, res) => {
    try {
      const allUsers = await users.findAll();
      res.status(200).json(allUsers);
    } catch (error) {
      logger.error(error);
      res.status(500).send('Erro ao buscar usuários.');
    }
  });

  
  app.post('/posts', async (req, res) => {
    try {
      const { title, content, author } = req.body;
      if (!title || !content || !author) throw new Error('Título, conteúdo e autor são obrigatórios!');
      await posts.create(title, content, author);
      res.status(201).send('Post criado com sucesso!');
    } catch (error) {
      logger.error(error);
      res.status(400).send(error.message);
    }
  });

  app.get('/posts', async (req, res) => {
    try {
      const allPosts = await posts.findAll();
      res.status(200).json(allPosts);
    } catch (error) {
      logger.error(error);
      res.status(500).send('Erro ao buscar posts.');
    }
  });

  
  app.post('/comments', async (req, res) => {
    try {
      const { postId, content, author } = req.body;
      if (!postId || !content || !author) throw new Error('Post ID, conteúdo e autor são obrigatórios!');
      await comments.create(postId, content, author);
      res.status(201).send('Comentário criado com sucesso!');
    } catch (error) {
      logger.error(error);
      res.status(400).send(error.message);
    }
  });

  app.get('/comments/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const postComments = await comments.findByPostId(postId);
      res.status(200).json(postComments);
    } catch (error) {
      logger.error(error);
      res.status(500).send('Erro ao buscar comentários.');
    }
  });

  
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
