const {MongoClient} = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

const dbName = 'shop';

async function main() {
  await client.connect();
  console.log('Connected successfully to DB');
}

main().catch(console.error);

module.exports = client.db(dbName);
