#!/usr/bin/env node

const path = require('path')
const File = require('../src/file/file').File

const appDirectory = process.argv[2]
console.log(appDirectory, path.resolve(appDirectory))
