// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain;
const path = require('path')
let newwin;
let mainwin;
var position;

//import database
var SqliteDB = require('./js/db.js').SqliteDB;
var sqlitedb = new SqliteDB('my.db');
// create table.
var createPassWordTableSql = "create table if not exists password(bandname INTEGER, password INTEGER, row INTEGER, content BLOB);";
//var createLabelTableSql = "create table if not exists labels(level INTEGER, longitude REAL, latitude REAL, content BLOB);";
sqlitedb.createTable(createPassWordTableSql);
// var tileData = [[1, 10, 10,1], [1, 11, 11,2], [1, 10, 9,3], [1, 11, 9,4]];
// var insertTileSql = "insert into password(bandname, cardnum, password, content) values(?, ?, ?, ?)";
// sqlitedb.insertData(insertTileSqltileData);
//sqliteDB.createTable(createLabelTableSql);
 
function createWindow () {
  // Create the browser window.
  mainwin = new BrowserWindow({
    width: 65,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration:true,
      webviewTag: true
    }
  })

  // and load the index.html of the app.
  mainwin.loadFile('index.html')
  position = mainwin.getPosition();
  mainwin.setPosition(position[0] - 300,position[1])
  // Open the DevTools.
  //mainwin.webContents.openDevTools();
}

ipc.on('pw',()=>{
  newwin = new BrowserWindow({
    width: 900, 
    height: 600,
    parent: mainwin,
    frame: false,
    webPreferences: {
      nodeIntegration: true,  //注入node模块
      webviewTag: true
    }
  })
  newwin.loadURL(path.join('file:',__dirname,'page/pwmanager.html')); //new.html是新开窗口的渲染进程
  newwin.setPosition(position[0] - 235,position[1]);
  //newwin.webContents.openDevTools();
})

ipc.on('addpw',()=>{
  newwin = new BrowserWindow({
    width: 500, 
    height: 400,
    parent: mainwin,
    frame: false,
    webPreferences: {
      nodeIntegration: true  //注入node模块
    }
  })
  newwin.loadURL(path.join('file:',__dirname,'page/addpw.html')); //new.html是新开窗口的渲染进程
  newwin.webContents.openDevTools();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
