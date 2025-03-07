const express = require(`express`);

const app = express();

app.use(express.json());

const transaksiController = require(`../controllers/transaksi.controller`);

const auth = require("../auth"); // import fungsi auth

app.get("/getAllData", auth, transaksiController.getTransaksi);

app.get("/getById/:id", auth, transaksiController.getById);

app.get("/getByIdUser/:id_user", auth, transaksiController.getByIdUser);

app.post("/create", auth, transaksiController.addTransaksi);

app.patch("/edit/:id_transaksi", auth, transaksiController.updateTransaksi);

app.delete("/delete/:id_transaksi", auth, transaksiController.deleteTransaksi);

app.get("/filter/tgl_transaksi/:tgl_transaksi", transaksiController.filterTgl);

app.get("/filter/nama_user/:nama_user", auth, transaksiController.filterNama);

app.get(
  "/filter/bulan_transaksi/:bulan_transaksi",
  auth,
  transaksiController.filterBulan
);
module.exports = app;
