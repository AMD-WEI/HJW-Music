import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    id: 0,
    durationTime: 0,
    currentSong: {},
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
    playerModeIndex: 0,
    playerModeName: "order",  //  0:循环播放  1：单曲循环   2：随机播放

    isPlaying: false,

    playListSongs: [],
    playListIndex: 0
  },

  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        playerStore.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      // 0.修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.lyricInfos = []

      // 1.根据id请求数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      }),

        getSongLyric(id).then(res => {
          const lyricString = res.lrc.lyric
          const lyrics = parseLyric(lyricString)
          ctx.lyricInfos = lyrics
        })

      // 使用audioContext播放歌曲，自动播放
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      // 只有首次播放才需要监听下面的事件
      if (ctx.isFirstPlay) {
        // 监听audioContext的一些事件
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx) {
      // 监听歌曲可以播放
      // 准备工作完成之后就会调用播放
      // 这里搞两种都会播放，但是防止有什么意外导致autoplay不播放，所以加下面的代码
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        const currentIndex = i - 1
        // 这里设置一个currentLyricIndex用作判断，当前歌词是否已经被写入到currentLyricText
        // 当currentLyricIndex不等于currentIndex的时候，才会写入currentLyricText
        // 歌词切换之间是有时间间隔的，比如00:01:13播放“你好”,00:01:20播放“hello”,那么在此期间onTimeUpdate()函数会被一直触发，
        // 但是上面得63行条件在这期间是一直不成立的，不会跳出执行外层代码，下面的代码会被执行多次，歌词currentLyricText会被设置多次，造成性能浪费
        //如果不加判断ctx.lyricInfos[currentIndex]是否为空，可能会导致报错，因为onTimeUpdate调用的太快，导致ctx.lyricInfos[currentIndex]还没拿到值就执行下一次onTimeUpdate
        if (ctx.currentLyricIndex != currentIndex && ctx.lyricInfos[currentIndex]) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricText = currentLyricInfo.lyricText
          ctx.currentLyricIndex = currentIndex
        }
      })

      // 监听是否播放完成，完成后下一曲播放
      audioContext.onEnded(() => {
        this.dispatch("switchMusicAction")
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    switchMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex
      switch (ctx.playerModeIndex) {
        case 0:  //随机播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1:  //单曲循环
          break
        case 2:  //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      let currentSong = ctx.playListSongs[index]
      // 这里做的判断是因为可以在开发者工具中直接点击保存的编译模式进入播放页面，此时点进去playListSongs播放列表是空的
      // 因为playListSongs是在点击song-item-v1或者song-item-v2中存放进去的，这里做判断如果从上面拿的currentSong是空的，
      // 则把发送网络请求playMusicWithSongIdAction保存到playerStore中的currentSong赋值给currentSong,此时是不需要记录播放歌曲在播放列表中的index
      // 只有当不是从编译模式中进去播放页面才需要记录播放歌曲在播放列表中的index
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }
      // 就算播放列表里面只有一首歌，当点击下一首时还要重新播放
      playerStore.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    },
  },
})

export {
  audioContext, playerStore
}