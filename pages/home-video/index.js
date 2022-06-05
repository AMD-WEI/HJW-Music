// pages/home-video/index.js
import { getTopMV } from "../../service/api_video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },


  /**
   * 
   */
  // onLoad: function (options) {
  //   getTopMV(0).then(res => {
  //     this.setData({ topMVs: res.data })
  //   })
  // },

  onLoad: async function () {
    this.getTopMVData(0)
  },

  //点击事件
  handleVideoItemClick: function(event){
    const id = event.currentTarget.dataset.item.id
    
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },

  //封装网络请求的方法
  getTopMVData: async function (offset) {
    //判断是否可以请求
    if (!this.data.hasMore) return

    //展示加载动画,顶部有个小圆圈在转
    wx.showNavigationBarLoading()


    //请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }

    //设置数据
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading();
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  //下拉刷新
  onPullDownRefresh: async function () {
    this.getTopMVData(0)
  },

  //拉到底部进行数据请求
  onReachBottom: async function () {
    this.getTopMVData(this.data.topMVs.length)
  }
})