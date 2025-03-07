// import getLocalStorage dari helper/localStorage yang sudah dibuat
import { getLocalStorage } from "./helper/localStorage";

// buat constant untuk menyimpan url server
const BASE_API = "http://localhost:8000";
// buat constant untuk menyimpan url server untuk image
const BASE_API_IMAGE = "http://localhost:8000/cover";

// buat constant untuk menyimpan key local storage
const LOCAL_STORAGE_TOKEN = "WikusamaCafe/token";
const LOCAL_STORAGE_USER = "WikusamaCafe/user";

// buat constant untuk menyimpan token
const TOKEN = {
  headers: {
    Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
  },
};

// export constant
export {
  BASE_API,
  BASE_API_IMAGE,
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_USER,
  TOKEN,
};
