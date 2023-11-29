import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { mongoose } from 'mongoose';
import { DatabaseMongo } from './database-mongo.js';

// Criando instância do Express e do DatabaseMongo
const app = express();
const database = new DatabaseMongo();

// Middleware para analisar solicitações e registrar informações
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] MÉTODO: ${req.method} EM: ${req.url}`);
  next();
});

// Middleware para analisar solicitações JSON
app.use(express.json());

// Rota para criar um novo vídeo
app.post('/videos',
  [
    // Validando dados recebidos na requisição
    body('title').isString(),
    body('description').isString(),
    body('duration').isNumeric()
  ],
  (request, response) => {
    // Verificando se há erros de validação
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    // Extraindo dados do corpo da requisição
    const { title, description, duration } = request.body;

    // Chamando método create do DatabaseMongo para adicionar o vídeo
    database.create({
      title,
      description,
      duration,
    });

    // Respondendo com status 201 (Created)
    response.status(201).send();
  });

// Rota para listar todos os vídeos
app.get('/videos', async (request, response) => {
    try {
      // Obtendo parâmetro de busca da requisição
      const search = request.query.search;
  
      // Chame o método list do DatabaseMongo para obter os vídeos
      const videos = await database.list(search);
      
       // Respondendo com a lista de vídeos
      response.send(videos);
      
    } catch (error) {
      // Tratamento de erro em caso de falha na busca
      console.error('Error fetching videos:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Rota para atualizar um vídeo existente com base no ID
app.put('/videos/:id',
  [
    // Validando parâmetros da requisição
    param('id').isMongoId(),
    body('title').isString(),
    body('description').isString(),
    body('duration').isNumeric() 
  ],
  async (request, response) => {
    try {
      // Verificando erros de validação
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      // Obtendo ID do vídeo a ser atualizado
      const videoId = request.params.id;
      const { title, description, duration } = request.body;

      // Chamando método update do DatabaseMongo para atualizar o vídeo
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

// Configurando e iniciando servidor na porta 3333
const port = 3333;
app.listen(port, () => {
    // Conecta ao MongoDB
    mongoose.connect('mongodb+srv://wallacedasilvabarbosa:CJjbs1IbNv2IDBcs@videos-api.poy1oza.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server listening at http://localhost:${port}`);
});

// Configurando e iniciando servidor na porta 3333
export default app