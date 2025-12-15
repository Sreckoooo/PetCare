import mongoose from "mongoose";

const petZdraviloSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    zdravilo: { type: mongoose.Schema.Types.ObjectId, ref: "Zdravilo", required: true },
    odmerek: { type: String, required: true },
    pogostost: { type: String, required: true },
    datum_zacetka: { type: Date, required: true },
    datum_konca: { type: Date, required: false },
  },
  { timestamps: true }
);

const PetZdravilo = mongoose.model("PetZdravilo", petZdraviloSchema);
export default PetZdravilo;