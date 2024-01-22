import mongoose, { Connection } from "mongoose";

export class Database {
  private connection!: Connection;

  constructor() {}

  public connect(): void {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://mongo:27017/product-api";

    mongoose.connect(mongoURI, {});

    this.connection = mongoose.connection;

    this.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    this.connection.once("open", () => {
      console.log("Connected to MongoDB");
    });
  }

  public getConnection(): Connection {
    return this.connection;
  }
}
