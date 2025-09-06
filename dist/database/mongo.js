import mongoose, {} from "mongoose";
export class MongoClient {
    static instance;
    Db;
    constructor() { }
    static getInstance() {
        if (!MongoClient.instance) {
            MongoClient.instance = new MongoClient();
        }
        return MongoClient.instance;
    }
    async connect() {
        const MongoDBUri = process.env.MONGODB_URI || "mongodb://root:password@localhost:27017";
        if (mongoose.connection.readyState === 0) {
            try {
                await mongoose.connect(MongoDBUri, {
                    dbName: "openHealthSyncApi",
                });
                console.log("MongoDB conectado com sucesso!");
            }
            catch (error) {
                console.error("Erro ao conectar no MongoDB:", error);
                throw error;
            }
        }
        else {
            console.log("MongoDB já está conectado, reutilizando a conexão...");
        }
        this.Db = mongoose.connection;
        return mongoose;
    }
    disconnect() {
        return mongoose.disconnect();
    }
}
//# sourceMappingURL=mongo.js.map