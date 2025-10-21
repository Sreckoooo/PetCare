import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String, // npr. pes, mačka
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;