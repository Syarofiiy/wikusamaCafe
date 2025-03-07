// import library yang dibutuhkan
import axios from "axios";
import {
  BASE_API,
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_USER,
} from "../../../utils/constants";
import {
  setLocalStorage,
  getLocalStorage,
} from "../../../utils/helper/localStorage"; // jangan lupa import getLocalStorage

export default async function LoginHandler(values) {
  const LOGIN_URL = BASE_API + "/user/login"; // gunakan BASE_API dari constants
  try {
    const logindata = await axios.post(LOGIN_URL, values);
    const response = logindata.data;

    console.log(response); // pastikan Anda melihat data di console

    if (response.status === "success") {
      // Simpan token ke localStorage
      setLocalStorage(LOCAL_STORAGE_TOKEN, response.token);

      // Simpan user dan role ke localStorage
      setLocalStorage(LOCAL_STORAGE_USER, response.data); // Simpan semua data user (termasuk role)

      console.log(
        "Token saved to localStorage:",
        getLocalStorage(LOCAL_STORAGE_TOKEN)
      );
      console.log(
        "User saved to localStorage:",
        getLocalStorage(LOCAL_STORAGE_USER)
      );

      return response;
    }

    return Promise.resolve({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    return Promise.resolve({
      status: "error",
      message: err.response?.data?.message,
    });
  }
}
