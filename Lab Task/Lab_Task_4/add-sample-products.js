const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/stoneisland')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const products = await Product.find();
    console.log('Products in database:', products.length);
    
    if (products.length === 0) {
      console.log('No products found. Creating sample products...');
      
      const sampleProducts = [
        {
          name: 'Stone Island Jacket',
          price: 299.99,
          description: 'Premium quality jacket with innovative design and materials.',
          image: '/Images/Image1.jpg',
          category: 'jackets',
          inStock: true
        },
        {
          name: 'Stone Island Shirt',
          price: 89.99,
          description: 'Comfortable and stylish shirt perfect for any occasion.',
          image: '/Images/Image2.jpg',
          category: 'shirts',
          inStock: true
        },
        {
          name: 'Stone Island Pants',
          price: 149.99,
          description: 'High-quality pants with excellent fit and durability.',
          image: '/Images/Image3.jpg',
          category: 'pants',
          inStock: true
        },
        {
          name: 'Stone Island Hoodie',
          price: 179.99,
          description: 'Comfortable hoodie with premium materials and design.',
          image: '/Images/Image4.jpg',
          category: 'jackets',
          inStock: true
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('Sample products created!');
    } else {
      console.log('Products already exist in database');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  }); 