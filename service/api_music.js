import JWRequest from "./index"

export function getBanners() {
  return JWRequest.get("/banner", {
    type: 2
  })
}

export function getRankingsDetail() {
  // return JWRequest.get("/top/list", {
  //   idx
  // })
  return JWRequest.get("/toplist/detail", {

  })
}

export function getRankings(id) {
  return JWRequest.get("/playlist/detail", {
    id
  })
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