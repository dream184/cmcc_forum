const redis = require('redis')
const client = (process.env.NODE_ENV !== 'production') ? redis.createClient() : redis.createClient({url: process.env.REDIS_URL})
async function redisConnect () {
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
}
module.exports = { client, redisConnect } 