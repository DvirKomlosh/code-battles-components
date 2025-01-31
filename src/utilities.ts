export interface RoundInfo {
  players: string[]
  map: string
}

export const getLocalStorage = (key: string, defaultValue = {}) => {
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue))
}

export const setLocalStorage = (key: string, value = {}) => {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(
    new StorageEvent("storage", { key, newValue: JSON.stringify(value) })
  )
}

export const toTitleCase = (s: string) => {
  return s
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(" ")
}

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export const getRank = (
  tournamentInfo: any,
  team: string,
  pointModifier: any
) => {
  if (!tournamentInfo?.teams?.map) {
    return -1
  }

  const sorted: any[] = tournamentInfo.teams.sort(
    (a: any, b: any) =>
      b.points +
      (pointModifier![b.name] ?? 0) -
      a.points -
      (pointModifier![a.name] ?? 0)
  )

  return sorted.findIndex((t) => t.name === team)
}

export const updatePointModifier = () => {
  const rounds: RoundInfo[] = getLocalStorage("Rounds", [])
  const results = getLocalStorage("Results", {})

  const pointModifier: Record<string, number> = {}
  for (const round of rounds) {
    if (
      results[round.players.join(", ")] &&
      results[round.players.join(", ")][round.map]
    ) {
      const first =
        round.players[results[round.players.join(", ")][round.map][0]]
      const second =
        round.players[results[round.players.join(", ")][round.map][1]]
      if (!pointModifier[first]) {
        pointModifier[first] = 0
      }
      if (!pointModifier[second]) {
        pointModifier[second] = 0
      }

      pointModifier[first] += 2
      pointModifier[second] += 1
    }
  }
  setLocalStorage("Point Modifier", pointModifier)
}

const DIGITS = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

export const toPlacing = (n: number) => {
  if (10 < n && n < 20) {
    return n.toString() + "th"
  }
  return n.toString() + DIGITS[n % 10]
}

export const zeroPad = (s: string, l: number) => {
  for (let i = s.length; i < l; i++) {
    s = "0" + s
  }

  return s
}
