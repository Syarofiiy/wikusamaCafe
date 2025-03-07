const userModel = require("../models/index").user;
const bcrypt = require("bcrypt"); // import library bcrypt untuk enkripsi password
const Op = require(`sequelize`).Op;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "WikusamaCafe";

exports.getAllUser = async (request, response) => {
  await userModel
    .findAll() // mengambil semua data user
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan data user
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

exports.getUserByID = async (request, response) => {
  await userModel
    .findByPk(request.params.id)
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

exports.getByRole = async (request, response) => {
  await userModel
    .findAll({
      where: { role: request.params.role },
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

exports.userLogin = async (request, response) => {
  const data = await userModel.findOne({
    where: { username: request.body.username },
  });
  if (data) {
    const validPassword = await bcrypt.compare(
      request.body.password,
      data.password
    );
    if (validPassword) {
      let payload = JSON.stringify(data);
      let token = jwt.sign(payload, SECRET_KEY);
      response.status(200).json({
        status: "success",
        logged: true,
        message: "Password Benar",
        token: token,
        data: data,
      });
    } else {
      response.status(400).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }
  }
};

exports.findUser = async (request, response) => {
  userModel
    .findAll({
      // query untuk mencari data user berdasarkan nama user
      where: {
        [Op.or]: [
          // query untuk mencari data user berdasarkan nama user
          { nama_user: { [Op.like]: "%" + request.params.nama_user + "%" } },
        ],
      },
    })
    .then((result) => {
      // jika berhasil
      if (result.length > 0) {
        // jika data user ditemukan
        response.status(200).json({
          // mengembalikan response dengan status code 200 dan data user
          status: "success",
          message: "user berhasil ditemukan",
          data: result,
        });
      } else {
        // jika data user tidak ditemukan
        response.status(400).json({
          // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: "user not found",
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
  const data = {
    nama_user: request.body.nama_user,
    role: request.body.role,
    username: request.body.username,
    password: bcrypt.hashSync(request.body.password, 10),
    resultArr: {},
  };
  await userModel
    .findAll({
      where: {
        [Op.or]: [{ username: data.username }],
      },
    })
    .then((result) => {
      resultArr = result;
      if (resultArr.length > 0) {
        response.status(400).json({
          status: "error",
          message: "Username sudah terdaftar",
        });
      } else {
        userModel
          .create(data)
          .then((result) => {
            response.status(200).json({
              status: "success",
              message: "User berhasil didaftarkan",
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

exports.updateUser = async (request, response) => {
  const param = { id_user: request.params.id_user }; // inisialisasi parameter untuk query update data
  const data = {
    // inisialisasi data user yang akan diubah dengan data yang dikirimkan melalui body request
    nama_user: request.body.nama_user,
    role: request.body.role,
    username: request.body.username,
    password: request.body.password,
    resultArr: {},
  };

  // cek password
  if (data.password) {
    // jika password dikirimkan melalui body request
    const salt = await bcrypt.genSalt(10); // generate salt
    data.password = await bcrypt.hash(data.password, salt); // generate password hash
  }

  if (data.username) {
    // jika username dikirimkan melalui body request
    userModel
      .findAll({
        // mengambil semua data user
        where: {
          // query untuk mencari data user berdasarkan username
          [Op.or]: [{ username: data.username }], // query untuk mencari data user berdasarkan username
        },
      })
      .then((result) => {
        // jika berhasil
        resultArr = result; // menyimpan data user yang ditemukan ke dalam variabel resultArr
        if (resultArr.length > 0) {
          // jika data user ditemukan
          response.status(400).json({
            // mengembalikan response dengan status code 400 dan pesan error
            status: "error",
            message: "username sudah terdaftar",
          });
        }
      });
  }
  userModel
    .update(data, { where: param }) // query untuk mengubah data user berdasarkan id user
    .then((result) => {
      // jika berhasil
      response.status(200).json({
        // mengembalikan response dengan status code 200 dan pesan sukses
        status: "success",
        message: "user has been updated",
        data: {
          // data user yang telah diubah
          id_user: param.id_user,
          nama_user: data.nama_user,
          username: data.username,
          role: data.role,
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
};

exports.deleteUser = async (request, response) => {
  const param = { id_user: request.params.id_user }; // inisialisasi parameter untuk query delete data
  // delete data

  userModel
    .destroy({ where: param }) // query untuk menghapus data user berdasarkan id user
    .then((result) => {
      // jika berhasil

      response.status(200).json({
        // mengembalikan response dengan status code 200 dan pesan sukses
        status: "success",
        message: "user has been deleted",
        data: param,
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
