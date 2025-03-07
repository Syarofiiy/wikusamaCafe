const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "public"))); //inisialisasi static file untuk menyimpan file gambar

const user = require("./routes/user.route");

app.use("/user", user);

const menu = require("./routes/menu.route");

app.use("/menu", menu);

app.use(express.static(__dirname));

const transaksi = require(`./routes/transaksi.route`);

app.use(`/transaksi`, transaksi);

const detail = require(`./routes/detail_transaksi.route`);

app.use(`/detail_transaksi`, detail);

const meja = require(`./routes/meja.route`);

app.use(`/meja`, meja);

app.listen(8000, () => {
  console.log("Server run on port 8000");
});
