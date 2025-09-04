import mongoose, { type Connection, type ConnectOptions } from "mongoose";

export class MongoClient {
  private static instance: MongoClient;
  public Db!: Connection;

  private constructor() {}

  public static getInstance(): MongoClient {
    if (!MongoClient.instance) {
      MongoClient.instance = new MongoClient();
    }
    return MongoClient.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    const MongoDBUri = process.env.MONGODB_URI || "mongodb://root:password@localhost:27017";

    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(MongoDBUri, {
          dbName: "openHealthSyncApi",
        } as ConnectOptions);
        console.log("MongoDB conectado com sucesso!");
      } catch (error) {
        console.error("Erro ao conectar no MongoDB:", error);
        throw error;
      }
    } else {
      console.log("MongoDB já está conectado, reutilizando a conexão...");
    }

    this.Db = mongoose.connection;
    return mongoose;
  }

  public disconnect(): Promise<void> {
    return mongoose.disconnect();
  }
}
