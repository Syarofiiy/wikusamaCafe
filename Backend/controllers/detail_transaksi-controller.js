const detailModel = require(`../models/index`).detail_transaksi;

const Op = require(`sequelize`).Op;

const fn = require(`sequelize`);

const col = require(`sequelize`);

const model = require("../models/index");

exports.addDetail = async (request, response) => {
  const data = {
    id_transaksi: request.body.id_transaksi,
    id_menu: request.body.id_menu,
    harga: request.body.harga,
    jumlah: request.body.jumlah,
  };

  await detailModel
    .create(data)
    .then((result) => {
      response.status(200).json({
        status: "success",
        message: "Detail transaksi berhasil ditambahkan",
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

exports.deleteDetail = async (request, response) => {
  const param = {
    id_detail_transaksi: request.params.id_detail_transaksi,
  };

  detailModel
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        // jika data ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan pesan detail_transaksi berhasil dihapus
          status: "success",
          message: "detail transaksi berhasil dihapus",
          data: param,
        });
      } else {
        response.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
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

exports.updateDetail = async (request, response) => {
  const param = {
    id_detail_transaksi: request.params.id_detail_transaksi,
  };

  if (!param.id_detail_transaksi) {
    return response.status(400).json({
      status: "error",
      message: "id_detail_transaksi is required",
    });
  }

  const data = {
    id_transaksi: request.body.id_transaksi,
    id_menu: request.body.id_menu,
    harga: request.body.harga,
    jumlah: request.body.jumlah,
  };

  detailModel.findOne({ where: param }).then((result) => {
    if (result) {
      detailModel
        .update(data, { where: param })
        .then((result) => {
          response.status(200).json({
            status: "success",
            message: "Data berhasil diubah",
            data: {
              id_detail_transaksi: param.id_detail_transaksi,
              ...data,
            },
          });
        })
        .catch((error) => {
          response.status(400).json({
            status: "error",
            message: error.message,
          });
        });
    } else {
      response.status(404).json({
        status: error,
        message: "Data tidak ditemukan",
      });
    }
  });
};

exports.getAllDetail = async (request, response) => {
  await detailModel
    .findAll()
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

exports.getDetailByID = async (request, response) => {
  await detailModel
    .findByPk(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json({
          status: "success",
          data: result,
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

exports.getByIdTransaksi = async (request, response) => {
  await detailModel
    .findAll({
      where: { id_transaksi: request.params.id_transaksi }, // mengambil semua data detail_transaksi berdasarkan id_transaksi yang dikirimkan melalui parameter
      include: [
        {
          model: model.menu,
          as: "menu",
        },
      ],
    }) // mengambil semua data detail_transaksi
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
      });
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

exports.getMenu = async (request, response) => {
  await detailModel
    .findAll({
      attributes: [
        "id_menu",
        [fn("SUM", col("detail_transaksi.jumlah")), "jumlah"],
      ],
      include: [
        {
          model: model.menu,
          as: "menu",
        },
      ],
      group: ["id_menu"],
      order: [[literal("jumlah"), "DESC"]],
    }) // mengambil semua data detail_transaksi
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
      });
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

exports.getPendapatan = async (request, response) => {
  const param = { tgl_transaksi: request.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await detailModel
    .findAll({
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [[fn("SUM", col("detail_transaksi.harga")), "pendapatan"]],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: "transaksi",
          where: {
            tgl_transaksi: {
              [Op.between]: [
                param.tgl_transaksi + " 00:00:00",
                param.tgl_transaksi + " 23:59:59",
              ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
            },
          },
        },
      ],
      group: ["detail_transaksi.id_transaksi"],
    }) // mengambil semua data detail_transaksi
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
        total_keseluruhan: result.reduce(
          (a, b) => a + parseInt(b.dataValues.pendapatan),
          0
        ), // menghitung total keseluruhan pendapatan
      });
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

exports.getPendapatanBulan = async (request, response) => {
  const param = { tgl_transaksi: request.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await detailModel
    .findAll({
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [[fn("SUM", col("detail_transaksi.harga")), "pendapatan"]],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: "transaksi",
          where: literal(`MONTH(tgl_transaksi) = ${param.tgl_transaksi}`),
        },
      ],
      group: ["detail_transaksi.id_transaksi"],
    }) // mengambil semua data detail_transaksi
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
        total_keseluruhan: result.reduce(
          (a, b) => a + parseInt(b.dataValues.pendapatan),
          0
        ), // menghitung total keseluruhan pendapatan
      });
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
