import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://petrematei:parola@cluster0.xqilzh8.mongodb.net/e-health?retryWrites=true&w=majority&appName=Cluster0';

let client;
let db;

async function connectToDatabase() {
  if (!client || !client.isConnected()) {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db();
  }
  return db;
}

const relationalDb = connectToDatabase();

// Use named exports instead of default
export { relationalDb };