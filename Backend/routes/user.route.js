const express = require(`express`);
const app = express();
const auth = require("../auth"); // import fungsi auth

app.use(express.json());

const userController = require(`../controllers/user.controller`);

let { validateUser, validateLogin } = require(`../middleware/user-validation`);

app.get("/getAllData", auth, userController.getAllUser);

app.get("/getById/:id", auth, userController.getUserByID);

app.get("/getByRole/:role", auth, userController.getByRole);

app.post("/register", [validateUser], userController.add);

app.post("/login", [validateLogin], userController.userLogin);

app.get("/search/:nama_user", auth, userController.findUser);

app.patch("/edit/:id_user", auth, userController.updateUser);

app.delete("/delete/:id_user", auth, userController.deleteUser);

module.exports = app;
