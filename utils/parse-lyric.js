//正则(regular)表达式(expression)

//[00:58.65]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split("\n")
  const lyricInfos = []

  for (const lineString of lyricStrings) {
    const timeResult = timeRegExp.exec(lineString)
    if (!timeResult) continue
    //获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millSecondTime = timeResult[3]
    const millSecond = millSecondTime.length === 2 ? millSecondTime * 10 : millSecondTime * 1
    const time = minute + second + millSecond

    //获取歌词
    const lyricText = lineString.replace(timeRegExp, "")
    lyricInfos.push({ time, lyricText })
  }
  return lyricInfos
}