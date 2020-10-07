import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import Product from './models/Product.js';
import products from './data/products.js';
import users from './data/users.js';
import configDB from './services/db.js';

configDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    const createdusers = await User.insertMany(users);
    const adminId = createdusers[0]._id;
    const myProducts = products.map(p => {
      return { ...p, user: adminId };
    });
    await Product.insertMany(myProducts);
    console.log(`Data Imported successfully`.green.inverse);
    process.exit();
  } catch (e) {
    console.log(`Error occured : ${e.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    console.log(`Data Deleted successfully`.green.inverse);
    process.exit();
  } catch (e) {
    console.log(`Error occured : ${e.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
