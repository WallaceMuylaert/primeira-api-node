import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { mongoose } from 'mongoose';
import { DatabaseMongo } from './database-mongo.js';

const app = express();
const database = new DatabaseMongo();

app.use(express.json());

// Middleware para registrar solicitações
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] MÉTODO: ${req.method} EM: ${req.url}`);
  next();
});

// Rota para criar um novo vídeo
app.post('/videos',
  [
    body('title').isString(),
    body('description').isString(),
    body('duration').isNumeric()
  ],
  (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { title, description, duration } = request.body;

    database.create({
      title,
      description,
      duration,
    });

    response.status(201).send();
  });

// Rota para listar todos os vídeos
app.get('/videos', async (request, response) => {
    try {
      const search = request.query.search;
  
      // Chame o método list do DatabaseMongo para obter os vídeos
      const videos = await database.list(search);
  
      response.send(videos);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Rota para atualizar um vídeo existente com base no ID
app.put('/videos/:id',
  [
    param('id').isMongoId(),
    body('title').isString(),
    body('description').isString(),
    body('duration').isNumeric() 
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const videoId = request.params.id;
      const { title, description, duration } = request.body;

      await database.update(videoId, {
        title,
        description,
        duration,
      });

      return response.status(204).send();
    } catch (error) {
      console.error('Error updating video:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Rota para excluir um vídeo com base no ID
app.delete('/videos/:id',
  [
    param('id').isMongoId()
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const videoId = request.params.id;

      await database.delete(videoId);

      return response.status(204).send();
    } catch (error) {
      console.error('Error deleting video:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  });


const port = 3333;

app.listen(port, () => {
    // Conecta ao MongoDB
    mongoose.connect('mongodb+srv://wallacedasilvabarbosa:CJjbs1IbNv2IDBcs@videos-api.poy1oza.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server listening at http://localhost:${port}`);
});

export default app

