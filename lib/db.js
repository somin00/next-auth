import MongoClient from "mongodb/lib/mongo_client";

const DB_PWD = process.env.NEXT_PUBLIC_MONGO_PWD;

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://root:${DB_PWD}@cluster0.wvwp8.mongodb.net/next-auth?retryWrites=true&w=majority`
  );
  return client;
}
