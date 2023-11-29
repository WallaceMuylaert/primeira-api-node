import mongoose from 'mongoose';

// Definindo o esquema do documento para vídeos
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
});

// Criando um modelo mongoose com base no esquema
const VideoModel = mongoose.model('Video', videoSchema);

// Classe responsável por interagir com o MongoDB para operações de CRUD em vídeos
export class DatabaseMongo {
  // Método para listar vídeos com suporte à pesquisa
  async list(search) {
    try {
      let query = {};
      // Se houver uma consulta de pesquisa, construa uma consulta para correspondência parcial do título (case-insensitive)
      if (search) {
        query = { title: { $regex: search, $options: 'i' } };
      }
  
      // Consultando vídeos no MongoDB com base na consulta construída
      const videos = await VideoModel.find(query).lean();
      // Mapeando a resposta para um formato desejado (incluindo o campo "id" em vez de "_id")
      return videos.map(({ _id, ...data }) => ({ id: _id, ...data }));
    } catch (error) {
      console.error('Error listing videos:', error);
      throw error;
    }
  }

  // Método para criar um novo vídeo no MongoDB
  async create(video) {
    try {
      // Criando uma instância do modelo VideoModel com os dados do vídeo
      const newVideo = new VideoModel(video);
      // Salvando o novo vídeo no MongoDB
      await newVideo.save();
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  // Método para atualizar um vídeo existente no MongoDB com base no ID
  async update(id, video) {
    try {
      // Atualizando o documento no MongoDB com base no ID
      await VideoModel.findByIdAndUpdate(id, video);
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  // Método para excluir um vídeo do MongoDB com base no ID
  async delete(id) {
    try {
      // Excluindo o documento no MongoDB com base no ID
      await VideoModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}
