import mongoose from 'mongoose';
// Schema


const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
   },
   last_name: {
      type: String,
    },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,  // Ensures consistent casing
      trim: true       // Automatically trims whitespace
    },
   job_title: {
      type: String,
   },
   gender: {
      type: String,
    },
},
   { timestamps: true }
);

// Model
const User = mongoose.model('User', userSchema);

export  default 'User'

// Mongoose is an ODM(Object Data Modeling) library for Node.js & MongoDB that helps:

// ✅ Define schemas(data structure)
// ✅ Enforce validation(required fields, data types)
// ✅ Simplify CRUD operations(create, read, update, delete)
// ✅ Support middleware(pre / post hooks)
// ✅ Handle relationships(like SQL joins via populate)