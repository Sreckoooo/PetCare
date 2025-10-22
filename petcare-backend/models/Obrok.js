import mongoose from "mongoose";

const obrokSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    datum: { type: Date, required: true },
    ura: { type: String, required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Obrok = mongoose.model("Obrok", obrokSchema);
export default Obrok;