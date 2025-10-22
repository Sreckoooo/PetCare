import mongoose from "mongoose";

const zdraviloSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    odmerek: { type: String, required: true },
    pogostost: { type: String, required: true },
    datum_zacetka: { type: Date, required: true },
    datum_konca: { type: Date },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Zdravilo = mongoose.model("Zdravilo", zdraviloSchema);
export default Zdravilo;