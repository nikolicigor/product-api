import express, { Application, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import Database from "./data/mongoose";

class Server {
  private app: Application;
  private _database: Database;

  constructor() {
    this.app = express();
    this._database = new Database();
    this.setupRoutes();
    this.startServer();
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

  private startServer(): void {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

const server = new Server();
