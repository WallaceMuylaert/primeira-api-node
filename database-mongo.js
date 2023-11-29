import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
});

const VideoModel = mongoose.model('Video', videoSchema);

export class DatabaseMongo {
  async list(search) {
    try {
      let query = {};
      if (search) {
        query = { title: { $regex: search, $options: 'i' } };
      }
  
      const videos = await VideoModel.find(query).lean();
      return videos.map(({ _id, ...data }) => ({ id: _id, ...data }));
    } catch (error) {
      console.error('Error listing videos:', error);
      throw error;
    }
  }

  async create(video) {
    try {
      const newVideo = new VideoModel(video);
      await newVideo.save();
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  async update(id, video) {
    try {
      await VideoModel.findByIdAndUpdate(id, video);
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await VideoModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}
