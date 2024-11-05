import { Schema, model } from "mongoose";
import { cartService } from "../services/cart.service.js";

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: {
      type: String,
      required: true,
      // select: false, //use with caution - exclude by default
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "cart",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const newCart = await cartService.create({});
    this.cart = newCart._id;
  } catch (error) {
    next(error);
  }
});

export const userModel = model("user", userSchema);
