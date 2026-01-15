const mongoose = require('mongoose');
const City = require('../models/cityModel');
const Hotel = require('../models/hotelModel');

const africa = require('../Data/Africa.json');
const asia = require('../Data/Asia.json');
const europe = require('../Data/europe_cities.json');
const northAmerica = require('../Data/NorthAmerica_cities.json');
const southAmerica = require('../Data/SouthAmerica.json');
const oceania = require('../Data/Oceania.json');

const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedCities() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Optional cleanup
    await City.deleteMany();
    await Hotel.deleteMany();

    const allCities = [...africa, ...asia, ...europe, ...northAmerica, ...southAmerica, ...oceania];

    for (const cityData of allCities) {
      const {
        city,
        country,
        continent,
        tags,
        attractions,
        hotels,
        image
      } = cityData;

      if (!city || !country || !continent) {
        console.warn('⚠️ Skipping invalid city entry:', cityData);
        continue;
      }

      // Insert city
      const newCity = await City.create({
        name: city,
        country,
        continent,
        tags,
        popularSpots: attractions,
        image
      });

      // Flatten and insert hotels
      for (const starCategory in hotels) {
        let starLevel = parseInt(starCategory[0]);
        if (starLevel > 5) starLevel = 5;  // "7_star" → 5
        for (const hotel of hotels[starCategory]) {
          await Hotel.create({
            name: hotel.name,
            city: newCity._id,
            pricePerNight: hotel.price_per_night,
            stars: starLevel
          });
        }
      }

      console.log(`✅ Seeded: ${city}, ${country}`);
    }

    console.log('🌍 All cities and hotels inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding cities:', err);
    process.exit(1);
  }
}

seedCities();
