import mongoose from "mongoose";

const opomnikSchema = new mongoose.Schema(
  {
    datum: { type: Date, required: true },
    ura: { type: String, required: true },
    naziv: { type: String, required: true },
    status: { type: String, required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Opomnik = mongoose.model("Opomnik", opomnikSchema);
export default Opomnik;