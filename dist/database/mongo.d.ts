import mongoose, { type Connection } from "mongoose";
export declare class MongoClient {
    private static instance;
    Db: Connection;
    private constructor();
    static getInstance(): MongoClient;
    connect(): Promise<typeof mongoose>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=mongo.d.ts.map