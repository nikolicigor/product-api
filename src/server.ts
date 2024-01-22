import express, { Application, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql";
import { Database } from "./data/mongoose";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

class Server {
  private app: Application;
  private _database: Database;

  constructor() {
    this.app = express();
    this._database = new Database();
    this._database.connect();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GraphQL endpoint
    this.app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        graphiql: true,
      })
    );

    // Health endpoint
    this.app.get("/health", (_req: Request, res: Response) => {
      res.send("OK");
    });
  }

  public startServer(): void {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

const server = new Server();
server.startServer();
