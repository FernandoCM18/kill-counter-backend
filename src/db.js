import mongoose from 'mongoose';

const dbConnection = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err);
    throw new Error('Error a la hora de inicializar BD');
  }
}

export default dbConnection;
