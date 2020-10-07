import mongoose from 'mongoose';
import colors from 'colors';

const configDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`MONGODB Connected : ${conn.connection.host}`.green.bold);
  } catch (e) {
    console.error(`ERROR occured : ${e.message}`.red.underline);
    process.exit(1);
  }
};

export default configDB;
