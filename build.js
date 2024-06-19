import * as esbuild from 'esbuild'
import fs from 'node:fs'
import chalk from 'chalk'
import { setEnv, transfile } from './plugins.js'

const bundledFile = "build/bundle.js"

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
    .build({
        entryPoints: ['src/index.js'],
        bundle: true, 
        minify: true,
        outfile: 'build/bundle.js',
        loader: { '.js': 'jsx', '.png': 'file', '.jpg': 'file', '.svg': 'file'},
        format: 'cjs',
        metafile: true,
        logLevel: 'info',
        define: setEnv()
    })
    .then(async (result) => {
        console.log('⚡ Bundle build complete ⚡')
        console.log(await esbuild.analyzeMetafile(result.metafile))
        fs.writeFileSync('meta.json', JSON.stringify(result.metafile))
        await transfile(bundledFile) // transfile bundle.js whenever source code changes and build again
        console.log(`  ${chalk.green('Done...')} transfiled ${chalk.yellow(bundledFile)} into ES5 by SWC`)
    })
    .catch(e => {
        console.log('❌Failed to bundle ❌')
        console.log(e)
        process.exit(1)
    })