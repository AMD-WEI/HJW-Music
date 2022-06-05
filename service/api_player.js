import jwRequest from "./index";

export function getSongDetail(ids) {
  return jwRequest.get("/song/detail", {
    ids
  })
}