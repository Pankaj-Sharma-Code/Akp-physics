import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true},
    domain: { type: String ,required:true},
    mobile: {type: Number, required: true,unique:true},
    email: { type: String, required: true, unique:true},
    image: { type: String, default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
    gender: { type: String ,required: true},
    password: {type:String,required: true}
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
