import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    fullName: { type: String },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "IN" },
    phone: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    // Profile
    name: { type: String, required: true }, // username
    fullName: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    profileImageUrl: { type: String, default: "" },
    password: { type: String, required: true },

    // Social/data
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    // Addresses
    addresses: [addressSchema],

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
