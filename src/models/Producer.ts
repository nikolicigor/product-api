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

producerSchema.index({ name: 1, country: 1, region: 1 }, { unique: true });

export default mongoose.model<IProducer>("Producer", producerSchema);
