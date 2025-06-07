import User from '../models/user.js'

async function handleGetAllUsers(req,res){
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch users" });
    }
}

async function handleGetUserById(req,res){
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

async function handleUpdateUserById(req,res){
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
}

async function handleDeleteUserById(req,res){
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ msg: 'User not found' });
       return res.json({ status: "Success", deletedId: req.params.id });
    } catch (error) {
        res.status(500).json({ msg: "Deletion failed" });
    }
}
async function handleCreateNewUser(req, res) {
    try {
        const { email } = req.body;
        const cleanEmail = email.toLowerCase().trim();

        // Simple check
        const exists = await User.findOne({ email: cleanEmail });
        if (exists) {
            console.log("Duplicate found:", exists.email);
            return res.status(400).json({ error: "Email exists" });
        }

        // Create user
        const user = await User.create({
            ...req.body,
            email: cleanEmail  // Save cleaned email
        });
        return res.status(201).json({
            message: "User created successfully",
            id: user._id
          });

    } catch (error) {
        console.log("Full error:", error);
        return res.status(500).json({ error: "Server error" });
    }
  }


export {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}
