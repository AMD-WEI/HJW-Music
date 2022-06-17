import jwRequest from "./index"

export function getTopMV(offset, limit = 10) {
  return jwRequest.get("/top/mv", {
    offset,
    limit
  })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id 
 */
export function getMVURL(id) {
  return jwRequest.get("/mv/url", {
    id
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
  return jwRequest.get("/mv/detail", {
    mvid
  })
}

/**
 * 
 * @param {number} id 请求MV视频相关视频 
 */
export function getRelatedVideo(id) {
  return jwRequest.get("/related/allvideo", {
    id
  })
}