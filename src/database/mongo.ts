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
    const URL = process.env.MONGODB_URL || "mongodb://localhost:27017/meuBanco";
    const username = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;

    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(URL, {
          user: username,
          pass: password,
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
