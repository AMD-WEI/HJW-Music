// pages/detail-songs/index.js
import { rankingStore, playerStore } from "../../../store/index"
import { getSongMenuDetail } from "../../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingName: "",  //新歌榜、原创榜、飙升榜 handleMoreClick
    songInfo: {},
    type: ""
    // rankingList: {},
    // songList: {}   //因为songList和rankingList存储的都是tracks的歌单，所以可以放在同一个对象里面，songInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if (type === "rank") {  //处理来自home-music的跳转，handleMoreClick

      const rankingName = options.rankingName

      this.setData({ rankingName }) //保存从home-music传递过来的排行榜名字

      rankingStore.onState(this.data.rankingName, this.getRankingDataHandler) //这里的ranking是排行榜的名字，对应在ranking-store.js里面是数组的名字
      //这里监听存放在state的榜单数据，并保存到rankingList

    } else if (type === "menu") { //处理来自song-menu-area的跳转，传递过来（热门、推荐）某些歌单的id，handleMenuItemCilck

      const id = options.id
      getSongMenuDetail(id).then(res => { //通过某歌单的id向接口发送查询，返回的是某歌单的所有歌
        this.setData({ songInfo: res.playlist })  //保存查询某歌单返回的所有歌
      })
    }
  },

  getRankingDataHandler: function (res) {
    this.setData({ songInfo: res })  //保存某榜单的所有歌
  },

  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
    }
  },
})