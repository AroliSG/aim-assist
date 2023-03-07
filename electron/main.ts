import { app, BrowserWindow, ipcMain, screen} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { defaultHudSize } from './utils/constants';

import './utils/rpc';
import 'dotenv/config';

import * as path from 'path';
import store from './utils/store';
import ipcHandler from './utils/ipc';


const createHud = () => {
  const display = screen.getAllDisplays ()[store.get('displayId')??0];
  const win     = new BrowserWindow ({
    width: 50,
    height: 50,
    autoHideMenuBar: true,
    frame: false,
    focusable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.setVisibleOnAllWorkspaces (true, {
    visibleOnFullScreen:true
  });

    // moving hud to last coordinates
  const x             = parseInt((store.get('moveIt') && store.get('moveIt').x)??0,10);
  const y             = parseInt((store.get('moveIt') && store.get('moveIt').y)??0,10);

    // multiplying scale by width and height
  const width         = Math.floor(defaultHudSize.x * (parseInt(store.get('scale')??1,10)??defaultHudSize.x));
  const height        = Math.floor(defaultHudSize.y * (parseInt(store.get('scale')??1,10)??defaultHudSize.y));

    // height by scaling if was set before shut down
  win.setSize (width,height);

    // always on top on mode [screen-saver]
  win.setAlwaysOnTop (true, "screen-saver");

    // ignoring mouse events
  win.setIgnoreMouseEvents (true);

    // moving on top of everything
  win.moveTop ();

    // boundaries
    // this will move the element where it was left it before
  win.setBounds({
    x: Math.floor ((display.bounds.x + display.bounds.width/2) - (width/2) + x),
    y: Math.floor ((display.bounds.y + display.bounds.height/2) - (height/2) + y),
  });

  if (app.isPackaged) {
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    let devtools = new BrowserWindow()
    win.webContents.setDevToolsWebContents(devtools.webContents)
    win.webContents.openDevTools({ mode: 'detach' })
    win.loadURL('http://localhost:3000/hud');
  };

  return win;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
  //  maxHeight: 600,
  //  maxWidth: 700,
    autoHideMenuBar: false,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    let devtools = new BrowserWindow()
    win.webContents.setDevToolsWebContents(devtools.webContents)
    win.webContents.openDevTools({ mode: 'detach' })
    win.loadURL('http://localhost:3000/landing');

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  return win;
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  const winLanding  = createWindow ();
  const winHud      = createHud ();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

    /*
      * @[ipcHandler]
      ? this method will handle all ipc calls
    */
  ipcHandler (
    winHud,
    winLanding
  );
});