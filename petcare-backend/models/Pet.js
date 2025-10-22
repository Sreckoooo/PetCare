import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ime: {
      type: String,
      required: true,
    },
    pasma: {
      type: String, 
      required: true,
    },
    datum_rojstva: {
      type: Date,
      required: true,
    },
    spol: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;