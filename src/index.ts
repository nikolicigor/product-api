var express = require("express");
var mongoose = require("mongoose");
var { graphqlHTTP } = require("express-graphql");
import schema from "./graphql/schema";

const app = express();

mongoose.connect("mongodb://mongo:27017/product-api", {});

export default mongoose;
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

//health endpoint
app.get("/health", (_: any, res: any) => {
  console.log("health check");
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
