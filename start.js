import * as esbuild from 'esbuild'
import detect from 'detect-port'
import chalk from 'chalk'
import { setEnv, transfilePlugin } from './plugins.js'

const port = 8000
const bundledFile = "build/bundle.js"
const onRequest = async (args) => {
    const { remoteAddress, method, path, status, timeInMS } = args
    console.log(`${remoteAddress} - "${method} ${path}" ${(status === 404 || status === 500) ? chalk.red(status) : chalk.green(status)} [${timeInMS}ms]`) 
    // await transfile(bundledFile) // transfile bundle.js whenever source code changes and build again
    // console.log('Done... transfile into ES5')
}

// html 
esbuild
    .build({
        entryPoints: ['public/index.html'],
        outfile: 'build/index.html',
        loader: { '.html': 'copy' }
    })
    .then(() => console.log('⚡ Bundle build complete ⚡'))
    .catch(e => {
        console.log('❌Failed to bundle ❌')
        console.log(e)
        process.exit(1)
    })

// js, css, files 
esbuild
    .context({
        entryPoints: ['src/index.js'],
        bundle: true, 
        minify: true,
        outfile: 'build/bundle.js',
        loader: { '.js': 'jsx', '.png': 'file', '.jpg': 'file', '.svg': 'file'},
        format: 'cjs',
        sourcemap: true,
        logLevel: 'info',
        define: setEnv(),
        plugins: [transfilePlugin]
    })
    .then(async (ctx) => {
        console.log('⚡ Bundle build complete ⚡')
        await ctx.watch()
        
        detect(port).then(async _port => { // detect if port is available first 
            if (port == _port) {
                console.log(`port: ${port} was not occupied`)
                await ctx.serve({ servedir: 'build', fallback: `build/index.html`, onRequest })
              } else {
                console.log(`port: ${port} was occupied, try port: ${_port}`)
                await ctx.serve({ servedir: 'build', port: _port, fallback: `build/index.html`, onRequest })
              }
        })
    })
    .catch(e => {
        console.log('❌Failed to bundle ❌')
        console.log(e)
        process.exit(1)
    })