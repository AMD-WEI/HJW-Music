// pages/home-profile/index.js
import { getUserInfo } from "../../service/api_login"
Page({
  data: {

  },

  getUserProfile: async function () {
    const res = await getUserInfo()
    console.log(res);
  }
})