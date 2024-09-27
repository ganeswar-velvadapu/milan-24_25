import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  bio: {
    type: String,
  },
  degree:{
    type:String,
    required:true
  },
  branch:{
    type:String,
    required:true
  },
  isPlaced:{
    type:Boolean,
  },
  hostel:{
    type:String,
    required:true   
  },
  year:{
    type:String,
    required:true
  },
  conversations: [
    { type: mongoose.Schema.Types.ObjectId,
       ref: 'Conversation' 
    }
  ],

},{timestamps:true});

const  User = mongoose.model("User",userSchema)

export default User