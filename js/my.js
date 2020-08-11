const ipc = require('electron').ipcRenderer;
function pw(){
    ipc.send("pw");
}