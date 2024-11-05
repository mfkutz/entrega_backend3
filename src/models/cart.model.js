import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      default: function () {
        return [];
      },
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("findOne", async function (next) {
  this.populate("products.product");
  next();
});

export const cartModel = model("cart", cartSchema);
