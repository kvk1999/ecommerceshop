import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      fullName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        quantity: Number,
        lineTotal: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Placed" },
    cancellationReason: { type: String, default: null },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Order", orderSchema);
