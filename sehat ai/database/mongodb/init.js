const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017/sehat');
  await client.connect();
  const db = client.db();

  await db.collection('knowledgeBase').createIndex({ source: 1, category: 1, language: 1 });
  await db.collection('memorySessions').createIndex({ sessionId: 1 }, { unique: true });
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
