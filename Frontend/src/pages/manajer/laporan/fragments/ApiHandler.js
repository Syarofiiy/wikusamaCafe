// import library yang dibutuhkan
import axios from "axios";
import { BASE_API } from "../../../../utils/constants";
import { getLocalStorage } from "../../../../utils/helper/localStorage";
import { LOCAL_STORAGE_TOKEN } from "../../../../utils/constants";

// fungsi untuk mengambil semua data laporan transaksi berdasarkan bulan
export const getAllDetailTransaksiByMonth = async (bulan) => {
  // url untuk mengambil semua data laporan transaksi berdasarkan bulan
  const URL = `${BASE_API}/detail_transaksi/getPendapatanBulan/${bulan}`;
  // melakukan request ke server
  try {
    // melakukan request ke server
    const data = await axios.get(URL, {
      // menambahkan header Authorization
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`, // mengambil token dari local storage
      },
    });
    // mengambil data dari response
    const response = data.data;

    // jika status response adalah success
    if (response.status === "success") {
      // mengembalikan data laporan transaksi berdasarkan bulan
      return Promise.resolve({
        status: "success",
        data: response.data,
        total_keseluruhan: response.total_keseluruhan,
      });
    }
  } catch (err) {
    // jika terjadi error
    // mengembalikan error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};

// fungsi untuk mengambil semua data laporan transaksi berdasarkan date
export const getAllDetailTransaksiByDate = async (date) => {
  // url untuk mengambil semua data laporan transaksi berdasarkan date
  const URL = `${BASE_API}/detail_transaksi/getPendapatan/${date}`;
  // melakukan request ke server
  try {
    // melakukan request ke server
    const data = await axios.get(URL, {
      // menambahkan header Authorization
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`, // mengambil token dari local storage
      },
    });
    // mengambil data dari response
    const response = data.data;

    // jika status response adalah success
    if (response.status === "success") {
      // mengembalikan data laporan transaksi berdasarkan date
      return Promise.resolve({
        status: "success",
        data: response.data,
        total_keseluruhan: response.total_keseluruhan,
      });
    }
  } catch (err) {
    // jika terjadi error
    // mengembalikan error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};
