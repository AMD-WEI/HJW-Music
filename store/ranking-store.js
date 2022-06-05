import { HYEventStore } from "hy-event-store"
import { getRankings, getRankingsDetail } from "../service/api_music"

const rankingMap = { "N": "newRanking", "H": "hotRanking", "O": "originalRanking", "S": "upRanking" }
const rankingMap2 = { 0: "newRanking", 1: "hotRanking", 2: "originalRanking", 3: "upRanking" }

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, //0：新歌榜   N：新歌榜
    hotRanking: {},//1：热歌榜    H：热歌榜
    originalRanking: {},//2：原创榜   O：原创榜
    upRanking: {}//3：飙升榜    S：飙升榜
  },
  actions: {
    getRankingDataActions(ctx) {
      getRankingsDetail().then(res1 => {
        for (let i = 0; i < 4; i++) {
          const ToplistType = res1.list[i].ToplistType
          const songListId = res1.list[i].id
          const rankingName = rankingMap[ToplistType]
          getRankings(songListId).then(res2 => {
            ctx[rankingName] = res2.playlist
          })
        }
      })
      // for (let i = 0; i < 4; i++) {
      //   getRankings(i).then(res => {
      //     const rankingName = rankingMap[i]
      //     ctx[rankingName] = res.playlist
      // switch (i) {
      //   case 0:
      //     ctx.newRanking = res.playlist
      //   case 1:
      //     ctx.hotRanking = res.playlist
      //   case 2:
      //     ctx.originalRanking = res.playlist
      //   case 3:
      //     ctx.upRanking = res.playlist
      // }

      //   })
      // }

    }
  }
})

export { rankingStore, rankingMap, rankingMap2 }