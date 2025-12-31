import express from "express";

const app =  new express();
const PORT = 3000;

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.json());

//middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//middleware to validate user data
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;

  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({
      message: "firstName, lastName and hobby are required"
    });
  }
  next();
}

//dummy data
let users = [
  {
    id: "1",
    firstName: "Chaitali",
    lastName: "Mahato",
    hobby: "Coding"
  }
];

// CRUD Operations
//get all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

//get user by id
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

//create user using post
app.post("/user", validateUser, (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body
  };

  users.push(newUser);
  res.status(201).json(newUser);
});
//update user using put
app.put("/user/:id", validateUser, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { id: req.params.id, ...req.body };
  res.status(200).json(users[index]);
});
//delete user using delete
app.delete("/user/:id", (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);
  res.status(200).json({ message: "User deleted successfully" });
});

