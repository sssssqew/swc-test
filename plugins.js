import { loadEnv } from 'vite'
import swc from "@swc/core"
import fs from 'node:fs'

export const setEnv = (mode) => {
  mode = mode || "test"
  const define = {}
  const env = loadEnv(mode, process.cwd(), "")
  for(const k in env){
    if(k.includes('REACT_APP_')){ // filter env variables by REACT_APP_
      define[k] = JSON.stringify(env[k])
    }
  }
  return define
}

export const transfile = async (path) => {
  const output = await swc.transform(fs.readFileSync(path, 'utf-8'), {
      sourceMaps: false,
      isModule: false,
      minify: true, 
      jsc: {
      parser: {
          syntax: "ecmascript",
      },
      transform: {}, 
      },
  })
  fs.writeFileSync(path, output.code)
}

export const transfilePlugin = {
  name: 'transfile',
  setup(build) {
    build.onEnd(result => {
      console.log(`build ended with ${result.errors.length} errors`)
      transfile('build/bundle.js')
    })
  },
}