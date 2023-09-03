import { Button, Select } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useConfiguration } from "../../configuration"
import { useAPIs, useLocalStorage } from "../../hooks"
import * as pyscript from "../../pyscript"
import Block from "./Block"
import BotSelector from "./BotSelector"

const RunSimulationBlock = () => {
  const [apis, loading] = useAPIs()
  const [map, setMap] = useLocalStorage<string>({
    key: "Map",
    defaultValue: "NYC",
  })
  const [playerCount, setPlayerCount] = useLocalStorage<number>({
    key: "Player Count",
    defaultValue: 2,
  })
  const [playerAPIs, setPlayerAPIs] = useLocalStorage<string[]>({
    key: "Player APIs",
    defaultValue: ["None", "None"],
  })
  const [runningNoUI, setRunningNoUI] = useState(false)

  const configuration = useConfiguration()
  const navigate = useNavigate()

  const run = () => {
    navigate(`/simulation/${map.replaceAll(" ", "-")}/${playerAPIs.join("-")}`)
  }

  const run10NoUI = () => {
    if (loading) {
      console.error("Loading Bots, cannot run simulation yet!")
      return
    }
    setRunningNoUI(true)
    const players = playerAPIs.map((api) => (api === "None" ? "" : apis[api]))
    pyscript.run(
      `run_many_noui_simulation("${map}", ${JSON.stringify(
        players
      )}, ${JSON.stringify(playerAPIs)},10)`
    )
  }
  const run50NoUI = () => {
    if (loading) {
      console.error("Loading Bots, cannot run simulation yet!")
      return
    }
    setRunningNoUI(true)
    const players = playerAPIs.map((api) => (api === "None" ? "" : apis[api]))
    pyscript.run(
      `run_many_noui_simulation("${map}", ${JSON.stringify(
        players
      )}, ${JSON.stringify(playerAPIs)},50)`
    )
  }
  const run100NoUI = () => {
    if (loading) {
      console.error("Loading Bots, cannot run simulation yet!")
      return
    }
    setRunningNoUI(true)
    const players = playerAPIs.map((api) => (api === "None" ? "" : apis[api]))
    pyscript.run(
      `run_many_noui_simulation("${map}", ${JSON.stringify(
        players
      )}, ${JSON.stringify(playerAPIs)},100)`
    )
  }
  const run1000NoUI = () => {
    if (loading) {
      console.error("Loading Bots, cannot run simulation yet!")
      return
    }
    setRunningNoUI(true)
    const players = playerAPIs.map((api) => (api === "None" ? "" : apis[api]))
    pyscript.run(
      `run_many_noui_simulation("${map}", ${JSON.stringify(
        players
      )}, ${JSON.stringify(playerAPIs)},1000)`
    )
  }

  const runNoUI = () => {
    if (loading) {
      console.error("Loading Bots, cannot run simulation yet!")
      return
    }
    setRunningNoUI(true)
    const players = playerAPIs.map((api) => (api === "None" ? "" : apis[api]))
    pyscript.run(
      `run_noui_simulation("${map}", ${JSON.stringify(
        players
      )}, ${JSON.stringify(playerAPIs)})`
    )
  }

  useEffect(() => {
    // @ts-ignore
    window.showResults = (
      player_names: Array<string>,
      places: Array<number>
    ) => {
      notifications.show({
        title: `${player_names[places[0]]} won!`,
        message: "They finished in 1st place!",
        color: "green",
        icon: <i className="fa-solid fa-crown" />,
      })
      setRunningNoUI(false)
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    window.showManyResults = (
      player_names: Array<string>,
      wins: Array<number>
    ) => {
      let message = ""
      for (let x = 0; x < player_names.length; x++) {
        message += player_names[x] + " has won " + wins[x] + " times \n"
      }
      notifications.show({
        title: `results are in!`,
        message: message,
        color: "green",
        icon: <i className="fa-solid fa-crown" />,
      })
      setRunningNoUI(false)
    }
  }, [])

  return (
    <Block title="Run Simulation" logo="fa-solid fa-display">
      <Select
        icon={<i className="fa-solid fa-map" />}
        label="Map"
        data={configuration.maps}
        value={map}
        onChange={(s) => {
          if (s) {
            setMap(s)
          }
        }}
      />
      <BotSelector
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
        playerAPIs={playerAPIs}
        setPlayerAPIs={setPlayerAPIs}
        apis={apis}
      />

      <Button.Group mt="xs">
        <Button
          variant="default"
          w="50%"
          leftIcon={<i className="fa-solid fa-play" />}
          onClick={run}
        >
          Run
        </Button>
        <Button
          variant="default"
          w="50%"
          leftIcon={<i className="fa-solid fa-forward" />}
          onClick={runNoUI}
          loading={runningNoUI}
        >
          Run (No UI)
        </Button>
      </Button.Group>
      <Button.Group mt="xs">
        <Button
          variant="default"
          w="50%"
          leftIcon={<i className="fa-solid fa-forward" />}
          onClick={run10NoUI}
          loading={runningNoUI}
        >
          Run 10
        </Button>
        <Button
          variant="default"
          w="50%"
          leftIcon={<i className="fa-solid fa-forward" />}
          onClick={run50NoUI}
          loading={runningNoUI}
        >
          Run 50
        </Button>
        <Button
          variant="default"
          w="50%"
          leftIcon={<i className="fa-solid fa-forward" />}
          onClick={run100NoUI}
          loading={runningNoUI}
        >
          Run 100
        </Button>
      </Button.Group>
      <Button.Group mt="xs">
        <Button
          variant="default"
          w="100%"
          leftIcon={<i className="fa-solid fa-play" />}
          onClick={run1000NoUI}
          loading={runningNoUI}
        >
          Run 1000
        </Button>
      </Button.Group>
      <p style={{ textAlign: "center", display: "none" }} id="noui-progress" />
    </Block>
  )
}

export default RunSimulationBlock
