export const run = (code: string) => {
  try {
    // @ts-ignore
    pyscript.runtime.interface.runPython(code)
  } catch (e) {
    setTimeout(() => run(code), 1000)
  }
}
