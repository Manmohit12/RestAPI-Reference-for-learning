import express from 'express';
import users from './MOCK_DATA.json' with { type: 'json' };

const app = express();
const port = 8000;

// Routes
app.get("/api/users", (req, res) => {
   return res.json(users);
});
app.get('/users',(req,res)=>{
   const html=
   `
   <ul> 
   ${users.map((users)=> `<li>${users.first_name} </li>` ).join("")}

   </ul>
   `
   res.send(html);
});

app.route('/api/users/:id').get((req, res) => {
   const id = Number(req.params.id);
   const user = users.find((user) => user.id === id);
   return res.json(user);
}).patch((req,res)=>{ 
   //edit user with id
  return res.json({status:"pending"})
}).delete((req,res) => { 
   //delete user with id 
   return res.json({ status: "pending" }) })
   
 
//:id means ye kuch bhi ho skta ha


app.post('/api/users',(req,res)=>{
   //TODO-Create a new user
   return res.json({status:"pending"});
})



app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
