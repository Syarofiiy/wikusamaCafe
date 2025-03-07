const { where } = require("sequelize");
const mejaModel = require(`../models/index`).meja;

exports.getAllMeja = async (request, response) => {
  await mejaModel
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

exports.getMejaByID = async (request, response) => {
  await mejaModel
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

exports.getByStatus = async (request, response) => {
  const param = { status: request.params.status }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await mejaModel
    .findAll({ where: param }) // mengambil data meja berdasarkan status meja yang dikirimkan melalui parameter
    .then((result) => {
      // jika berhasil
      if (result) {
        // jika data ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data meja
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

exports.addMeja = async (request, response) => {
  const data = {
    nomor_meja: request.body.nomor_meja,
    status: "kosong",
  };
  await mejaModel
    .findOne({ where: { nomor_meja: data.nomor_meja } })
    .then((result) => {
      if (result) {
        response.status(400).json({
          status: "error",
          message: "Nomor meja sudah ada",
        });
      } else {
        mejaModel
          .create(data)
          .then((result) => {
            response.status(200).json({
              status: "success",
              message: "Meja sudah ditambahkan",
              data: result,
            });
          })
          .catch((error) => {
            response.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      }
    });
};

exports.deleteMeja = async (request, response) => {
  const param = { id_meja: request.params.id_meja };

  mejaModel
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          status: "success",
          message: "Meja berhasil dihapus",
          data: param,
        });
      } else {
        response.status(404).json({
          status: "success",
          message: "Data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      response.status(404).json({
        status: "error",
        message: error.message,
      });
    });
};

exports.editMeja = async (request, response) => {
  const param = { id_meja: request.params.id_meja };

  const data = {
    nomor_meja: request.body.nomor_meja,
    status: request.body.status,
  };

  mejaModel.findOne({ where: param }).then((result) => {
    if (result) {
      if (data.nomor_meja != null) {
        mejaModel
          .findOne({ where: { nomor_meja: data.nomor_meja } })
          .then((result) => {
            if (result) {
              response.status(400).json({
                status: "error",
                message: "Nomor meja sudah terisi",
              });
            } else {
              mejaModel
                .update(data, { where: { param } })
                .then((result) => {
                  response.status(200).json({
                    status: "success",
                    message: "Data berhasil diubah",
                    data: {
                      id_meja: param.id_meja,
                      nomor_meja: data.nomor_meja,
                    },
                  });
                })
                .catch((error) => {
                  response.status(400).json({
                    status: "error",
                    message: error.message,
                  });
                });
            }
          });
      } else {
        mejaModel
          .update(data, { where: param })
          .then((result) => {
            response.status(200).json({
              status: "success",
              message: "Data berhasil diubah",
              data: {
                nomor_meja: data.nomor_meja,
              },
            });
          })
          .catch((error) => {
            response.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      }
    } else {
      response.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }
  });
};

exports.search = async (request, response) => {
  mejaModel
    .findOne({
      // mengambil data meja berdasarkan nomor meja yang dikirimkan melalui parameter
      where: {
        nomor_meja: request.params.nomor_meja,
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
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan pesan hasil dari pencarian nomor meja
          status: "success",
          message:
            "hasil dari pencarian nomor meja " + request.params.nomor_meja,
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
