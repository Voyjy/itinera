const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => {
    console.error('❌ Cache Service Redis Error:', err);
});

// Connect immediately
client.connect()
    .then(() => console.log('✅ Cache Service: Connected to Redis'))
    .catch(err => console.error('❌ Redis connection failed:', err.message));

module.exports = client;
