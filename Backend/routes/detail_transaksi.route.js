const express = require(`express`);

const app = express();

app.use(express.json());

const detailController = require(`../controllers/detail_transaksi-controller`);

app.get("/getAllData", detailController.getAllDetail);

app.get("/getById/:id", detailController.getDetailByID);

app.get("/getByIdTransaksi/:id_transaksi", detailController.getByIdTransaksi);

app.get("/getMenu", detailController.getMenu);

app.get("/getPendapatan/:tgl_transaksi", detailController.getPendapatan);

app.get(
  "/getPendapatanBulan/:tgl_transaksi",
  detailController.getPendapatanBulan
);

app.post("/", detailController.addDetail);

app.delete("/delete/:id_detail_transaksi", detailController.deleteDetail);

app.patch("/edit/:id_detail_transaksi", detailController.updateDetail);

module.exports = app;
