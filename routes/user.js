
import { Router } from 'express';
const router = Router(); 
import { handleGetAllUsers, handleGetUserById, handleUpdateUserById, handleDeleteUserById, handleCreateNewUser } from '../controllers/user.js'

// GET ROUTE & POST 
router.route('/')
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)

//Three ROUTE
router.route('/:id')
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);
    




export default router;
