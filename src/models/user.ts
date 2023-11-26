import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email should be unique"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

export const User = models.User || model("User", userSchema);
