import mongoose from "mongoose";

const pregledSchema = new mongoose.Schema(
  {
    datum: { type: Date, required: true },
    veterinar: { type: String, required: true },
    naziv: { type: String, required: true },
    datoteka: { type: Buffer }, // datoteka kot blob
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Pregled = mongoose.model("Pregled", pregledSchema);
export default Pregled;