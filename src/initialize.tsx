import { notifications } from "@mantine/notifications"
import React from "react"
import {
  getLocalStorage,
  setLocalStorage,
  updatePointModifier,
} from "./utilities"

import "@fortawesome/fontawesome-free/css/all.min.css"
import "./index.css"

const initialize = () => {
  // @ts-ignore
  window.showAlert = (
    title: string,
    alert: string,
    color: string,
    icon: string,
    limitTime: number,
    isCode: boolean
  ) => {
    // @ts-ignore
    const difference = Date.now() - (window.lastSet ?? 0)

    if (difference >= limitTime) {
      notifications.show({
        title,
        message: alert.split("\n").map((line, index) => (
          <p key={index} style={{ margin: 0 }}>
            {isCode ? <code>{line}</code> : line}
          </p>
        )),
        color,
        icon: <i className={icon} />,
      })

      // @ts-ignore
      window.lastSet = Date.now()
    }
  }

  // @ts-ignore
  window.setResults = (
    playerNames: string[],
    places: number[],
    map: string
  ) => {
    // @ts-ignore
    playerNames = playerNames.toJs()
    // @ts-ignore
    places = places.toJs()

    const results = getLocalStorage("Results")
    if (!results[playerNames.join(", ")]) {
      results[playerNames.join(", ")] = {}
    }
    results[playerNames.join(", ")][map] = places
    setLocalStorage("Results", results)

    // @ts-ignore
    window.showResults(playerNames, places)
  }

  // @ts-ignore
  window.clearManyResults = (playerNames: string[], map: string) => {
    // @ts-ignore
    playerNames = playerNames.toJs()

    var many_results = getLocalStorage("ManyResults")
    if (!many_results) {
      many_results = {}
    }
    if (!many_results[playerNames.join(", ")]) {
      many_results[playerNames.join(", ")] = {}
    }
    many_results[playerNames.join(", ")][map] = new Array(
      playerNames.length
    ).fill(0)

    setLocalStorage("ManyResults", many_results)

    setLocalStorage("AmountResults", 0)
  }
  // @ts-ignore
  window.setManyResults = (
    playerNames: string[],
    places: number[],
    map: string,
    how_many: number
  ) => {
    // @ts-ignore
    playerNames = playerNames.toJs()
    // @ts-ignore
    places = places.toJs()

    const many_results = getLocalStorage("ManyResults")
    const amnt = getLocalStorage("AmountResults")

    many_results[playerNames.join(", ")][map][places[0]] += 1

    setLocalStorage("ManyResults", many_results)

    setLocalStorage("AmountResults", amnt + 1)
    if (amnt + 1 == how_many) {
      console.log(
        "Results:" + JSON.stringify(many_results[playerNames.join(", ")][map])
      )
      // @ts-ignore
      window.showManyResults(
        playerNames,
        many_results[playerNames.join(", ")][map]
      )
    }
  }
}

export default initialize
