const express = require(`express`);
const app = express();
const auth = require("../auth");
const multer = require("multer");

app.use(express.json());

const menuController = require(`../controllers/menu.controller`);

const upload = require("../controllers/upload-menu");

app.get("/getAllData", auth, menuController.getAllMenu);

app.get("/getById/:id", auth, menuController.getMenuByID);

app.get("/search/:nama_menu", auth, menuController.findMenu);

app.post("/create", auth, upload.single("gambar"), menuController.add);

app.patch(
  "/edit/:id_menu",
  upload.single("gambar"),
  auth,
  menuController.updateMenu
);

app.delete("/delete/:id_menu", auth, menuController.deleteMenu);

module.exports = app;
