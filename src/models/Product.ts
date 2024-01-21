import mongoose, { Document, Schema } from "mongoose";
import { Producer } from "./Producer";

export interface Product extends Document {
  vintage: string;
  name: string;
  producerId: mongoose.Types.ObjectId;
  producer?: Producer;
}

const productSchema = new Schema({
  vintage: { type: String, required: true },
  name: { type: String, required: true },
  producerId: { type: Schema.Types.ObjectId, ref: "Producer", required: true },
});

export default mongoose.model<Product>("Product", productSchema);
