'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { readFile, mkdir, writeFile, readdir, readFileSync } from 'fs'
import { format } from 'date-fns'
import path from 'path'
import { parser } from './parser'

const dirPath = path.join(app.getAppPath(), 'data')
const isDevelopment = process.env.NODE_ENV !== 'production'

const sendFiles = (event: Electron.IpcMainEvent) => {
  readdir(dirPath, (err, files) => {
    if (files && files.length > 0) {
      const contents = files.map((file) => ({
        name: `${file.replace('.json', '')}`,
        payments: JSON.parse(readFileSync(path.join(dirPath, file), 'utf-8')),
      }))
      event.sender.send('data-is-ready', JSON.stringify(contents))
    } else {
      event.sender.send('data-is-ready', JSON.stringify([]))
    }
  })
}

ipcMain.on('init', (event) => sendFiles(event))

ipcMain.on('open-file-dialog-for-file', (event, filePath) => {
  console.log('open-file-dialog-for-file', filePath)
  readFile(filePath, 'utf8', (err, data) => {
    console.log('read file')
    const payments = parser(data)
    const dateParts = payments[0].date.split('.')
    const date = new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0]),
    )

    const fileName = `${format(date, 'yyyy-MM')}.json`
    console.log('new filename', fileName)

    mkdir(dirPath, { recursive: true }, () => {
      writeFile(path.join(dirPath, fileName), JSON.stringify(payments), () => {
        sendFiles(event)
      })
    })
  })
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async (event) => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
