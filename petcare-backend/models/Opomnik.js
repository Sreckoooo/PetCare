import mongoose from "mongoose";

const opomnikSchema = new mongoose.Schema(
  {
    datum: { type: Date, required: true },
    ura: { type: String, required: true }, // HH:mm
    naziv: { type: String, required: true },

    tip: {
      type: String,
      enum: ["splošni", "zdravilo", "aktivnost", "obrok"],
      required: true,
      default: "splošni",
    },

    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },

    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },

    // 🔗 OPCIJSKE POVEZAVE
    zdravilo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zdravilo",
    },

    aktivnost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aktivnost",
    },

    obrok: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obrok",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Opomnik = mongoose.model("Opomnik", opomnikSchema);
export default Opomnik;