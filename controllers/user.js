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
async function handleCreateNewUser(req, res){
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
}


export {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}
