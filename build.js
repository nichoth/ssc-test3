// @ts-check
"use strict"

import path from 'path'
import fs from 'fs/promises'
import esbuild from 'esbuild'

//
// The output target is passed by the build tool,
// it's where we want to write all of our files.
//
const target = path.resolve(process.argv[2]);

if (!target) {
  console.log(' - Did not receive the build target path as an argument')
  process.exit(1)
}

const cp = async (a, b) => fs.copyFile(
  path.resolve(a),
  path.join(b, path.basename(a))
)

async function main () {
  await esbuild.build({
    entryPoints: ['src/render/index.js'],
    bundle: true,
    keepNames: true,
    // minify: true,
    outfile: path.join(target, 'render.js'),
    platform: 'browser'
  })

  await esbuild.build({
    entryPoints: ['test/render/index.js'],
    bundle: true,
    keepNames: true,
    // minify: true,
    outfile: path.join(target, 'test.js'),
    platform: 'browser'
  })

  await esbuild.build({
    entryPoints: ['src/main/index.js'],
    bundle: true,
    keepNames: true,
    // minify: true,
    // format: 'cjs',
    format: 'esm',
    outfile: path.join(target, 'main.js'),
    platform: 'node'
  })

  await cp('src/render/index.html', target)
}

main()
