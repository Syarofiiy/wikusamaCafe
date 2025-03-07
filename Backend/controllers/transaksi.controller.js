const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

const model = require("../models/index");

const transaksi = model.transaksi; // inisialisasi model transaksi
const user = model.user; // inisialisasi model user
const meja = model.meja; // inisialisasi model meja

const Op = require(`sequelize`).Op;

exports.addTransaksi = async (request, response) => {
  const data = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  await transaksi
    .create(data)
    .then((result) => {
      response.status(200).json({
        status: "success",
        message: "Transaksi berhasil ditambahkan",
        data: result,
      });
      return meja.update(
        { status: "terisi" },
        { where: { id_meja: request.body.id_meja } }
      );
    })
    .catch((error) => {
      response.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

exports.updateTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id_transaksi };

  const data = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  transaksi.findOne({ where: param }).then((result) => {
    if (result) {
      transaksi
        .update(data, { where: param })
        .then((result) => {
          response.status(200).json({
            status: "success",
            message: "Data berhasil diubah",
            data: {
              id_transaksi: param.id_transaksi,
              ...data,
            },
          });

          if (request.body.status === "lunas") {
            meja.update(
              { status: "kosong" },
              {
                where: { id_meja: request.body.id_meja },
              }
            );
          }
        })
        .catch((error) => {
          response.status(400).json({
            status: "error",
            message: error.message,
          });
        });
    } else {
      response.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }
  });
};

exports.deleteTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id_transaksi };
  await transaksi
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          status: "success",
          message: "Transaksi berhasil dihapus",
          data: param,
        });
      } else {
        response.status(404).json({
          status: "error",
          message: "Data tidak ditemukan",
        });
      }
    })

    .catch((error) => {
      response.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

exports.getTransaksi = async (request, response) => {
  await transaksi
    .findAll({
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      response.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((error) => {
      response.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

exports.getById = async (request, response) => {
  await transaksi
    .findByPk(request.params.id, {
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    }) // mengambil data transaksi berdasarkan id transaksi yang dikirimkan melalui parameter
    .then((result) => {
      // jika berhasil
      if (result) {
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data transaksi
          status: "success",
          data: result,
        });
      } else {
        // jika data tidak ditemukan
        response.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      response.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
};

exports.getByIdUser = async (request, response) => {
  await transaksi
    .findAll({
      where: { id_user: request.params.id_user },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    }) // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
    .then((result) => {
      // jika berhasil
      if (result) {
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data transaksi
          status: "success",
          data: result,
        });
      } else {
        // jika data tidak ditemukan
        response.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      response.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
};

exports.filterTgl = async (request, response) => {
  const param = { tgl_transaksi: request.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  transaksi
    .findAll({
      // mengambil data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
      where: {
        tgl_transaksi: {
          [Op.between]: [
            param.tgl_transaksi + " 00:00:00",
            param.tgl_transaksi + " 23:59:59",
          ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
        },
      },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      // jika berhasil
      if (result.length === 0) {
        // jika data tidak ditemukan
        response.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan pesan data ditemukan
          status: "success",
          message: "data ditemukan",
          data: result,
        });
      }
    })
    .catch((error) => {
      // jika gagal
      response.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
};

exports.filterNama = async (request, response) => {
  const param = { nama_user: request.params.nama_user }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  user
    .findAll({
      // mengambil data user berdasarkan nama user yang dikirimkan melalui parameter
      where: {
        nama_user: param.nama_user,
      },
    })
    .then((result) => {
      // jika berhasil
      if (result == null) {
        // jika data tidak ditemukan
        response.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        transaksi
          .findAll({
            // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
            where: {
              id_user: result[0].id_user,
            },
          })
          .then((result) => {
            // jika berhasil
            if (result.length === 0) {
              // jika data tidak ditemukan
              response.status(404).json({
                // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
                status: "error",
                message: "data tidak ditemukan",
              });
            } else {
              // jika data ditemukan
              response.status(200).json({
                // mengembalikan response dengan status code 200 dan pesan data ditemukan
                status: "success",
                message: "data ditemukan",
                data: result,
              });
            }
          })
          .catch((error) => {
            // jika gagal
            response.status(400).json({
              // mengembalikan response dengan status code 400 dan pesan error
              status: "error",
              message: error.message,
            });
          });
      }
    })
    .catch((error) => {
      // jika gagal
      response.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
};

exports.filterBulan = async (request, response) => {
  const params = { bulan_transaksi: request.params.bulan_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  transaksi
    .findAll({
      // mengambil data transaksi berdasarkan bulan transaksi yang dikirimkan melalui parameter
      where: {
        tgl_transaksi: {
          // mengambil 2 digit pertama dari bulan transaksi yang dikirimkan melalui parameter
          [Op.like]: params.bulan_transaksi + "%",
        },
      },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      // jika berhasil
      if (result.length === 0) {
        // jika data tidak ditemukan
        response.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan pesan data ditemukan
          status: "success",
          message: "data ditemukan",
          data: result,
        });
      }
    })
    .catch((error) => {
      // jika gagal
      response.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
};
