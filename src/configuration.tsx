import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import { createContext, useContext } from "react"

interface CodeBattlesRequiredConfiguration {
  firebase: any
  maps: string[]
  players: Record<string, string>
}

interface CodeBattlesOptionalConfiguration {
  primaryColor: string
  admin: string
  title: string
  firestore: Firestore
  authentication: Auth
}

export interface CodeBattlesConfiguration
  extends CodeBattlesRequiredConfiguration,
    Partial<CodeBattlesOptionalConfiguration> {}

interface CodeBattlesFullConfiguration
  extends CodeBattlesRequiredConfiguration,
    CodeBattlesOptionalConfiguration {}

export const DEFAULT_CONFIGURATION: Partial<CodeBattlesOptionalConfiguration> =
  {
    primaryColor: "#0bb04f",
    title: "Battlesnake",
    admin: "admin",
  }

const ConfigurationContext = createContext<
  CodeBattlesFullConfiguration | undefined
>(undefined)

export default ConfigurationContext

/** Use only inside {@link CodeBattlesProvider} */
export const useFirestore = () => {
  const configuration = useContext(ConfigurationContext)
  return configuration!.firestore
}

/** Use only inside {@link CodeBattlesProvider} */
export const useAuthentication = () => {
  const configuration = useContext(ConfigurationContext)
  return configuration!.authentication
}

/** Use only inside {@link CodeBattlesProvider} */
export const useConfiguration = () => {
  const configuration = useContext(ConfigurationContext)
  return configuration!
}
