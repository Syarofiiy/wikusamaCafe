const express = require(`express`);

const app = express();

app.use(express.json());

const mejaController = require(`../controllers/meja.controller`);

app.get("/getAllData", mejaController.getAllMeja);

app.get("/getById/:id", mejaController.getMejaByID);

app.get("getByStatus/:status", mejaController.getByStatus);

app.post("/create", mejaController.addMeja);

app.delete("/delete/:id_meja", mejaController.deleteMeja);

app.patch("/edit/:id_meja", mejaController.editMeja);

app.get("/search/:nomor_meja", mejaController.search);

module.exports = app;
