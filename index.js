import express from 'express';
import users from './MOCK_DATA.json' with { type: 'json' };
import fs, { appendFile } from "fs";

const app = express();
const port = 8000;

// Middleware
//jo bhi frontend se values a rahi ha (form data) usko object me convert karta ha 
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Also include this to parse JSON body (important!)


app.use((req,res,next)=>{
fs.appendFile('log.txt', `\n ${Date.now()} : ${req.method} : ${req.path} `,(err,data)=>{
next();

});
});


app.get('/users', (req, res) => {
   const html = `
   <ul> 
   ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
   </ul>
   `;
   res.send(html);
});

app.get('/api/users', (req, res) => {
   res.json(users); // Sends all users as JSON
});

app.route('/api/users/:id')
   .get((req, res) => {
      const id = Number(req.params.id);
      const user = users.find((user) => user.id === id);
      if(!user) return res.status(404).json({msg:'User not found'})
      return res.json(user);
   })
   .patch((req, res) => {
      const userId = parseInt(req.params.id);
      const index = users.findIndex(user => user.id === userId);

      if (index === -1) {
         return res.status(404).json({ status: "User not found" });
      }

      // Get updated data from the request body
      const updatedData = req.body;

      // Merge existing user data with new data
      users[index] = { ...users[index], ...updatedData };

    
      //users → This is your updated user list (array of users).
      //null → Means: "Include everything when converting to JSON."
      //2 → Means: "Make the JSON file look nice with 2 spaces of indentation."
      fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
         if (err) {
            return res.status(500).json({ status: "Error writing to file" });
         }

      });
      return res.json({ status: "Success","Updated user":userId});
   })
   
   .delete((req, res) => {
      const userId = parseInt(req.params.id);
      const index = users.findIndex(user => user.id === userId);

      if (index === -1) {
         return res.status(404).json({ status: "User not found" });
      }

      // Remove user
      //users.splice(position,how many want to remove)
      users.splice(index, 1);

      // Write updated array to file
      //JSON.stringify(value,replace,space)
      fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
         if (err) {
            return res.status(500).json({ status: "Error writing to file" });
         }

         return res.json({ status: "Success", deletedId: userId });
      });
   });

app.post('/api/users', (req, res) => {
   const body = req.body;
   if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
      return res.status(400).json({msg:"All fields are required"})
   }
   users.push({ ...body, id: users.length + 1 });
   fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
         return res.status(500).json({ status: "Error writing to file" });
      }
      return res.status(201).json({ status: "Success", id: users.length });
   });
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
