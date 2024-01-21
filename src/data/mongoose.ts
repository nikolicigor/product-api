import mongoose from "mongoose";

mongoose.connect("mongodb://mongo:27017/product-api", {});

export default mongoose;
