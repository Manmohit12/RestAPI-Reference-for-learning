import express from 'express';
import fs from "fs";
import mongoose from "mongoose";

const app = express();
const port = 8000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/apnaApp-1')
   .then(() => console.log('MongoDB Connected!'))
   .catch(err => console.log("MongoDB error - ", err));

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

// Logging Middleware
app.use((req, res, next) => {
   fs.appendFile('log.txt', `\n${Date.now()}: ${req.method} ${req.path}`, (err) => {
      if (err) console.error("Logging error:", err);
      next();
   });
});

// Routes

// POST Route
app.post('/api/users', async (req, res) => {
   if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Request body is empty" });
   }

   const {
      first_name,
      email,
      last_name,
      gender,
      job_title,
   } = req.body;

   if (!first_name || !email) {
      return res.status(400).json({ msg: "First name and email are required" });
   }

   try {
      const result = await User.create({
         first_name: first_name.trim(),
         last_name: last_name?.trim() || '',
         email: email.toLowerCase().trim(),  // Normalize directly here
         gender: gender?.trim() || '',
         job_title: job_title?.trim() || ''
      });

      return res.status(201).json({ msg: "Success", id: result._id });
   } catch (error) {
      console.error("User creation error:", error);

      if (error.code === 11000) {
         return res.status(400).json({
            msg: `Email '${email.toLowerCase().trim()}' already exists`
         });
      }

      if (error.name === 'ValidationError') {
         return res.status(400).json({
            msg: Object.values(error.errors).map(e => e.message).join(', ')
         });
      }

      return res.status(500).json({ msg: "Database insertion failed" });
   }
});

app.get('/users', async (req, res) => {
   try {
      const allUsers = await User.find({});
      const html = `
         <ul>
            ${allUsers.map(user => `<li>${user.first_name}</li>`).join("")}
         </ul>
      `;
      res.send(html);
   } catch (error) {
      res.status(500).send("Error loading users");
   }
});

app.get('/api/users', async (req, res) => {
   try {
      const allUsers = await User.find({});
      res.json(allUsers);
   } catch (error) {
      res.status(500).json({ msg: "Failed to fetch users" });
   }
});

app.route('/api/users/:id')
   .get(async (req, res) => {
      try {
         const user = await User.findById(req.params.id);
         if (!user) return res.status(404).json({ msg: 'User not found' });
         res.json(user);
      } catch (error) {
         res.status(500).json({ msg: "Server error" });
      }
   })
   .patch(async (req, res) => {
      try {
         const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
         );
         if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
         res.json({ status: "Success", updatedUser });
      } catch (error) {
         res.status(500).json({ msg: "Update failed" });
      }
   })
   .delete(async (req, res) => {
      try {
         const deletedUser = await User.findByIdAndDelete(req.params.id);
         if (!deletedUser) return res.status(404).json({ msg: 'User not found' });
         res.json({ status: "Success", deletedId: req.params.id });
      } catch (error) {
         res.status(500).json({ msg: "Deletion failed" });
      }
   });


app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});