import jwRequest from "./index"

export function getSearchHot() {
  return jwRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return jwRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export function getSearchResult(keywords) {
  return jwRequest.get("/search", {
    keywords
  })
}