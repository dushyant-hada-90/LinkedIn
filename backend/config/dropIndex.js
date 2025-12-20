import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URL;

async function dropIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const collection = mongoose.connection.collection("users");

    const indexes = await collection.indexes();
    console.log("Existing indexes:", indexes);

    const indexName = indexes.find(
      idx => idx.key && idx.key.userName === 1
    )?.name;

    if (!indexName) {
      console.log("No userName index found");
      return;
    }

    await collection.dropIndex(indexName);
    console.log(`Dropped index: ${indexName}`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

dropIndex();
