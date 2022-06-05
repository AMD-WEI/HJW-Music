// components/song-menu-area/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认歌曲"
    },
    songMenu: {
      type: Array,
      value: []
    },
    scrollX: {
      type: Boolean,
      value: false
    },
    scrollY: {
      type: Boolean,
      value: false
    },
    area: {
      type: String,
      value: "area"
    },
    menuListClass: {
      type: String,
      value: "menu-list"
    },
    menuItemClass: {
      type: String,
      value: "menu-item"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth: getApp().globalData.screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuItemCilck: function (event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: '/pages/detail-songs/index?id=' + item.id + '&type=menu'
      })
    }
  }
})
