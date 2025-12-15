import mongoose from "mongoose";

const zdraviloSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    vrsta_odmerka: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  },
  { timestamps: true }
);

const Zdravilo = mongoose.model("Zdravilo", zdraviloSchema);
export default Zdravilo;