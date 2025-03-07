const menuModel = require(`../models/index`).menu;
const { Op } = require(`sequelize`);
const path = require("path");
const fs = require("fs");

exports.getAllMenu = async (request, response) => {
  await menuModel
    .findAll() // mengambil semua data menu
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data menu
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

exports.getMenuByID = async (request, response) => {
  await menuModel
    .findByPk(request.params.id) // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    .then((result) => {
      // jika berhasil
      if (result) {
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data menu
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

exports.add = async (request, response) => {
  if (!request.file) {
    return response.status(400).json({
      status: "success",
      message: "Nothing to upload",
    });
  }

  let newMenu = {
    nama_menu: request.body.nama_menu,
    jenis: request.body.jenis,
    deskripsi: request.body.deskripsi,
    gambar: `${request.file.filename}`,
    harga: request.body.harga,
  };

  try {
    const result = await menuModel.create(newMenu);
    response.json({
      status: "success",
      data: result,
      message: "New menu has been inserted",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.findMenu = async (request, response) => {
  menuModel
    .findAll({
      // query untuk mencari data menu berdasarkan nama menu
      where: {
        [Op.or]: [
          // query untuk mencari data menu berdasarkan nama menu
          { nama_menu: { [Op.like]: "%" + request.params.nama_menu + "%" } },
        ],
      },
    })
    .then((result) => {
      // jika berhasil
      if (result.length > 0) {
        // jika data menu ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data menu
          status: "success",
          message: "menu berhasil ditemukan",
          data: result,
        });
      } else {
        // jika data menu tidak ditemukan
        response.status(400).json({
          // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: "menu not found",
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

exports.updateMenu = async (request, response) => {
  const param = { id_menu: request.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = {
    // inisialisasi data yang akan diubah
    nama_menu: request.body.nama_menu,
    jenis: request.body.jenis,
    deskripsi: request.body.deskripsi,
    harga: request.body.harga,
    resultArr: {},
  };

  menuModel.findOne({ where: param }).then((result) => {
    // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    if (result) {
      // jika data ditemukan
      if (request.file) {
        // jika data gambar tidak kosong
        let oldFileName = result.gambar; // mengambil nama file lama
        let dir = path.join(__dirname, "../public/image/", oldFileName); // mengambil lokasi file lama
        fs.unlink(dir, (err) => err); // menghapus file lama
        data.gambar = request.file.filename; // mengubah nama file gambar
      }
      menuModel
        .update(data, { where: param }) // mengubah data menu berdasarkan id menu yang dikirimkan melalui parameter
        .then((result) => {
          // jika berhasil
          response.status(200).json({
            // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_menu: param.id_menu,
              nama_menu: data.nama_menu,
              harga: data.harga,
              deskripsi: data.deskripsi,
              gambar: data.gambar,
              jenis: data.jenis,
            },
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
    } else {
      // jika data tidak ditemukan
      response.status(404).json({
        // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
};

exports.deleteMenu = async (request, response) => {
  const param = { id_menu: request.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  menuModel
    .destroy({ where: param }) // menghapus data menu berdasarkan id menu yang dikirimkan melalui parameter
    .then((result) => {
      // jika berhasil
      if (result) {
        // jika data ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan pesan menu berhasil dihapus
          status: "success",
          message: "menu berhasil dihapus",
          data: param,
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
