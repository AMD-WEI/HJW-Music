// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from "../../service/api_search"
import debounce from "../../utils/debounce"
import StringToNodes from "../../utils/string2nodes"

const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],  //网络请求返回来的热门搜索关键字
    searchSuggestSongs: [], //根据输入框的关键字发送网络查询的相关关键字
    searchValue: "",  //输入框输入的关键字
    suggestSongsNodes: [], //重新组成的nodes节点
    queryResultSongs: []  //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  //网络请求
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  //输入框事件处理
  handleSearchSuggest: function (event) {
    //获取关键字
    const searchValue = event.detail
    this.setData({ searchValue })

    //判断关键字是否为空
    if (!searchValue.length) {
      this.setData({ searchSuggestSongs: [],queryResultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }

    //防抖
    debounceGetSearchSuggest(searchValue).then(res => {
      const searchSuggestSongs = res.result.allMatch
      this.setData({ searchSuggestSongs })
      if(!searchSuggestSongs) return

      //将searchSuggestSongs的keyword遍历进suggestKeywords
      const suggestKeywords = searchSuggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        //根据keyword新建nodes节点
        const nodes = StringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },

  handleSearchAction: function () {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ queryResultSongs: res.result.songs })
    })
  },

  handleKeywordItemClick: function (event) {
    //获取searchSuggestSongs遍历出来的keyword
    const keyword = event.currentTarget.dataset.keyword

    this.setData({searchValue: keyword})

    this.handleSearchAction()
  }
})