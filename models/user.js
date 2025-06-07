import mongoose from 'mongoose';
// Schema


const userSchema = new mongoose.Schema({
   first_name: { type: String, required: true },
   last_name: String,
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Automatically convert to lowercase
      trim: true       // Automatically trim whitespace
   },
   gender: String,
   job_title: String
}, { timestamps: true });
 

// Model
const User = mongoose.model('User', userSchema);

export default User

// Mongoose is an ODM(Object Data Modeling) library for Node.js & MongoDB that helps:

// ✅ Define schemas(data structure)
// ✅ Enforce validation(required fields, data types)
// ✅ Simplify CRUD operations(create, read, update, delete)
// ✅ Support middleware(pre / post hooks)
// ✅ Handle relationships(like SQL joins via populate)