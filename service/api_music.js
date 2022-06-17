import JWRequest from "./index"
import { COOKIE } from "../constants/cookie_const"

const cookie = wx.getStorageSync(COOKIE)

export function getBanners() {
  return JWRequest.get("/banner", {
    type: 2
  })
}

export function getRankingsDetail() {

  return JWRequest.get("/toplist/detail", {}, true)
}

export function getRankings(id) {
  return JWRequest.get("/playlist/detail", { id }, true)
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return JWRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return JWRequest.get("/playlist/detail", {
    id
  })
}