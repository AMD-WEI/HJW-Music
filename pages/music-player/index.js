// pages/music-player/index.js
import {
  getSongDetail,
  getSongLyric
} from "../../service/api_player"
import {
  audioContext
} from "../../store/index"
import {
  parseLyric
} from "../../utils/parse-lyric"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    durationTime: 0,
    currentTime: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSilderChanging: false,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({ id })
    this.getPageData(id)
    this.getSongLyric(id)

    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navbarHeight = globalData.navbarHeight
    const contentHeight = screenHeight - statusBarHeight - navbarHeight
    const deviceRedio = globalData.deviceRedio
    this.setData({
      contentHeight,
      isMusicLyric: deviceRedio >= 2
    })

    // 使用audioContext播放歌曲
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    this.setupAudioContextListener()
  },

  //====================  事件监听  ====================
  setupAudioContextListener: function () {
    audioContext.onCanplay(() => {
      audioContext.play()
    })

    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000
      if (!this.data.isSilderChanging) {
        //记录滑条的位置
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
      let i = 0
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          break
        }
      }
      const currentIndex = i - 1
      if (this.data.currentLyricIndex != currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({ currentLyricText: currentLyricInfo.lyricText, currentLyricIndex: currentIndex })
      }
    })
  },

  //====================  网络请求  ====================
  getPageData: function (ids) {
    getSongDetail(ids).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
  },

  //获取歌词
  getSongLyric: function (id) {
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      this.setData({
        lyricInfos: lyrics
      })
    })
  },

  // ==================== 事件处理  ====================
  handleSliderChange: function (event) {
    // 1.获取slider变化的值
    const value = event.detail.value

    //2.计算当点击滑条时，滑条的位置与需要播放的音乐的时间对应的currentTime
    const currentTime = this.data.durationTime * value / 100

    //3.执行前先暂停音乐播放
    audioContext.pause()

    //4.执行当前滑条位置的音乐时间，这里会调用上面的onCanplay函数 
    audioContext.seek(currentTime / 1000)

    //5.记录最新的sliderValue
    //这里isSliderChanging设置为false是因为handleSliderChanging调用完成之后会调用handleSliderChange，这时从handleSliderChanging过来的isSilderChanging还是true
    this.setData({ sliderValue: value, isSilderChanging: false })
  },

  handleSliderChanging: function (event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime * sliderValue / 100
    this.setData({ currentTime, isSilderChanging: true, sliderValue })
    // this.setData({ isSilderChanging: true })
  },

  handleSwiperChange: function (event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },
})
