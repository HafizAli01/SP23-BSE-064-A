const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/stoneisland', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const sampleVehicles = [
  {
    name: 'Civic Sedan',
    brand: 'Honda',
    price: 25000,
    type: 'sedan',
    description: 'Reliable and fuel-efficient sedan perfect for daily commuting.',
    image: '/Images/vehicles/civic-sedan.jpg',
    inStock: true
  },
  {
    name: 'CR-V',
    brand: 'Honda',
    price: 35000,
    type: 'SUV',
    description: 'Spacious SUV with excellent safety ratings and modern features.',
    image: '/Images/vehicles/crv-suv.jpg',
    inStock: true
  },
  {
    name: 'F-150',
    brand: 'Ford',
    price: 45000,
    type: 'truck',
    description: 'Powerful pickup truck with towing capacity and rugged design.',
    image: '/Images/vehicles/f150-truck.jpg',
    inStock: true
  },
  {
    name: 'Mustang',
    brand: 'Ford',
    price: 40000,
    type: 'coupe',
    description: 'Iconic sports car with powerful engine and sleek design.',
    image: '/Images/vehicles/mustang-coupe.jpg',
    inStock: true
  },
  {
    name: 'Camry',
    brand: 'Toyota',
    price: 28000,
    type: 'sedan',
    description: 'Comfortable sedan known for reliability and smooth ride.',
    image: '/Images/vehicles/camry-sedan.jpg',
    inStock: true
  },
  {
    name: 'RAV4',
    brand: 'Toyota',
    price: 32000,
    type: 'SUV',
    description: 'Compact SUV with excellent fuel economy and safety features.',
    image: '/Images/vehicles/rav4-suv.jpg',
    inStock: true
  }
];

async function addSampleVehicles() {
  try {
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');

    // Add sample vehicles
    const vehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`Added ${vehicles.length} sample vehicles:`);
    
    vehicles.forEach(vehicle => {
      console.log(`- ${vehicle.brand} ${vehicle.name} (${vehicle.type}) - $${vehicle.price}`);
    });

    console.log('\nSample vehicles added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample vehicles:', error);
    process.exit(1);
  }
}

addSampleVehicles(); 