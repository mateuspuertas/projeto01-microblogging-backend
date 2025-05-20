const express = require('express');
const { MongoClient } = require('mongodb');
const winston = require('winston');

// Configuração do Winston (logs de erro)
const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' }),
  ],
});

const app = express();
app.use(express.json());

// Conexão com o MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'microblogging';

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    logger.error('Erro ao conectar ao MongoDB:', err);
    return;
  }
  console.log('Conectado ao MongoDB!');
  const db = client.db(dbName);

  // Rotas para Posts
  const posts = db.collection('posts');

  // Criar post
  app.post('/posts', async (req, res) => {
    try {
      const { title, content, author } = req.body;
      if (!title || !content || !author) throw new Error('Campos obrigatórios faltando!');
      await posts.insertOne({ title, content, author, createdAt: new Date() });
      res.status(201).send('Post criado com sucesso!');
    } catch (error) {
      logger.error(error);
      res.status(400).send(error.message);
    }
  });

  // Buscar todos os posts
  app.get('/posts', async (req, res) => {
    try {
      const allPosts = await posts.find().toArray();
      res.status(200).json(allPosts);
    } catch (error) {
      logger.error(error);
      res.status(500).send('Erro ao buscar posts.');
    }
  });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
