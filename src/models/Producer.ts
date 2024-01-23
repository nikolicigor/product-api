import mongoose, { Document, Schema } from "mongoose";

export interface IProducer extends Document {
  name: string;
  country?: string;
  region?: string;
}

const producerSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
  region: { type: String },
});

export default mongoose.model<IProducer>("Producer", producerSchema);
