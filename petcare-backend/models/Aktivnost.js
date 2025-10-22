import mongoose from "mongoose";

const aktivnostSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true },
    trajanje: { type: Number, required: true },
    datum: { type: Date, required: true },
    ura: { type: String, required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  },
  { timestamps: true }
);

const Aktivnost = mongoose.model("Aktivnost", aktivnostSchema);
export default Aktivnost;