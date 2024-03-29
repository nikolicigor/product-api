import mongoose, { Document, Schema } from "mongoose";
import { IProducer } from "./Producer";

export interface IProduct extends Document {
  vintage: string;
  name: string;
  producerId: mongoose.Types.ObjectId;
  producer?: IProducer;
}

const productSchema = new Schema({
  vintage: { type: String, required: true },
  name: { type: String, required: true },
  producerId: { type: Schema.Types.ObjectId, ref: "Producer", required: true },
});

productSchema.index({ vintage: 1, name: 1, producerId: 1 }, { unique: true });

export default mongoose.model<IProduct>("Product", productSchema);
