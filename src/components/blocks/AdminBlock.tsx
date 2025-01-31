import { Button, Select } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { notifications } from "@mantine/notifications"
import { Auth } from "firebase/auth"
import { Firestore, Timestamp, doc, getDoc, setDoc } from "firebase/firestore"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useConfiguration, useFirestore } from "../../configuration"
import { useUserAPIs } from "../../hooks"
import Block from "./Block"

const fetchPlayer = async (
  name: string,
  id: string,
  firestore: Firestore,
  auth: Auth
) => {
  const selection = await getDoc(
    doc(firestore, "/tournament/" + name.toLowerCase())
  )
  const pick = selection.data()?.pick
  const apis = await getDoc(doc(firestore, "/apis/" + id))
  const api = apis.data()![pick]

  if (api !== undefined) {
    await setDoc(
      doc(firestore, `/apis/${auth.currentUser?.uid}`),
      { [name]: api },
      { merge: true }
    )

    notifications.show({
      title: `Succesfully fetched ${name}`,
      message: `Their chosen bot name was ${pick}`,
      icon: <i className="fa-solid fa-check" />,
      color: "green",
    })
  } else {
    notifications.show({
      title: `${name} did not pick a valid Bot!`,
      message: `Their chosen bot name was ${pick}`,
      icon: <i className="fa-solid fa-xmark" />,
      color: "red",
    })
  }
}

const AdminBlock = () => {
  const firestore = useFirestore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apis] = useUserAPIs()
  const [chosenBot, setChosenBot] = useState("")
  const timeRef = useRef<HTMLInputElement>(null)
  const configuration = useConfiguration()

  const fetchLatestAPIs = () => {
    setLoading(true)

    const promises: Promise<void>[] = []
    for (const name in configuration.players) {
      const promise = fetchPlayer(
        name,
        configuration.players[name],
        firestore,
        configuration.authentication
      )
      promises.push(promise)
    }

    Promise.all(promises)
      .then(() => setLoading(false))
      .catch((e) => {
        setLoading(false)
        console.error(e)
      })
  }

  const publish = async () => {
    await setDoc(
      doc(firestore, "/apis/admin"),
      { [chosenBot]: apis[chosenBot] },
      { merge: true }
    )

    notifications.show({
      title: `Succesfully Published ${chosenBot}`,
      message: `Users will now be able to view the code and play against it`,
      icon: <i className="fa-solid fa-check" />,
      color: "green",
    })
    setChosenBot("")
  }

  const saveRoundTime = async () => {
    const selected = timeRef.current!.value
    const [hours, minutes] = selected.split(":")
    const now = new Date()
    now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
    await setDoc(
      doc(firestore, "/tournament/info"),
      {
        next: new Timestamp(now.getTime() / 1000, 0),
      },
      { merge: true }
    )
  }

  return (
    <Block title="Admin" logo="fa-solid fa-shield-halved">
      <Button
        mt="xs"
        fullWidth
        variant="white"
        leftIcon={<i className="fa-solid fa-edit" />}
        onClick={() => navigate("/round?edit=true")}
      >
        Edit Round
      </Button>
      <Button
        mt="xs"
        fullWidth
        variant="white"
        leftIcon={<i className="fa-solid fa-gamepad" />}
        onClick={() => navigate("/round")}
      >
        View Round
      </Button>
      <Button
        mt="xs"
        fullWidth
        variant="white"
        leftIcon={<i className="fa-solid fa-download" />}
        onClick={fetchLatestAPIs}
        loading={loading}
      >
        Fetch Latest Bots
      </Button>
      <TimeInput
        mt="xs"
        label="Next Round"
        ref={timeRef}
        icon={<i className="fa-solid fa-clock" />}
      />
      <Button
        mt="xs"
        fullWidth
        variant="white"
        leftIcon={<i className="fa-solid fa-save" />}
        onClick={saveRoundTime}
      >
        Save
      </Button>
      <Select
        mt="xs"
        icon={<i className="fa-solid fa-robot" />}
        label="Bot"
        data={Object.keys(apis).sort()}
        value={chosenBot}
        allowDeselect
        onChange={(e) => {
          if (e) {
            setChosenBot(e)
          } else {
            setChosenBot("")
          }
        }}
      />
      <Button
        mt="xs"
        fullWidth
        variant="white"
        leftIcon={<i className="fa-solid fa-globe" />}
        onClick={publish}
      >
        Publish
      </Button>
    </Block>
  )
}

export default AdminBlock
