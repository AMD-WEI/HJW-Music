// pages/home-music/index.js
import {
  getBanners, getSongMenu
} from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"
import { rankingStore,  rankingMap2 } from "../../store/index"

const throttleQueryRect = throttle(queryRect, 1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()

    //发起数据共享的网络请求，获取热歌排行榜数据
    rankingStore.dispatch("getRankingDataActions")

    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })

    rankingStore.onState("newRanking", this.getNewRankingHandler(0))
    rankingStore.onState("originalRanking", this.getNewRankingHandler(2))
    rankingStore.onState("upRanking", this.getNewRankingHandler(3))
  },

  getPageData: function () {
    getBanners().then(res => {
      //这里的setData是同步的，等到setData完成，下面的打印才会输出
      //setData在设置data数据上，是同步的
      //通过最新的数据对wxml进行渲染，渲染的过程是异步的
      this.setData({
        banners: res.banners
      })
      // console.log(this.data.banners);
    })

    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
      console.log("home-music/index.js:",res.playlists);
    })

    getSongMenu("流行").then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })
  },

  handleSearchClick: function () {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleSwiperImageLoaded: function () {
    throttleQueryRect(".swiper-item-image").then(res => {
      const rect = res[0]
      this.setData({
        swiperHeight: rect.height
      })
    })
  },

  handleMoreClick: function () {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx
    this.navigateToDetailSongsPage(rankingMap2[idx])
  },

  navigateToDetailSongsPage: function (rankingName) {
    wx.navigateTo({
      url: '/pages/detail-songs/index?rankingName=' + rankingName + '&type=rank'
    })
  },

  handleSongMenu: function (event) {
    const type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/songs-menu/index?type='+type,
    })
  },

  // 从state中获取出三个榜单的所有数据，将榜单三条数据和name、playCount等等存到rankings这个新的对象，因为首页就只展示三条榜单的歌
  getNewRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const playCount = res.playCount
      const coverImgUrl = res.coverImgUrl
      const songList = res.tracks.slice(0, 3)
      const rankingObject = { name, coverImgUrl, songList, playCount }
      const newRankings = { ...this.data.rankings, [idx]: rankingObject }
      this.setData({
        rankings: newRankings
      })
    }
  }
})