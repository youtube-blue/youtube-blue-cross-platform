const {app, Menu, BrowserWindow, ipcMain} = require('electron');
const { exec } = require("child_process");
const path = require('path');
const url = require('url');
let win;
var webViewURL;
function createWindow() {
    var template = [{
            label: "YouTube Blue",
            submenu: [
              {
                  label: "Download video",
                  click: async () => {
                    var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(':', '-').replace(':', '-').replace(' ', '-');
                    exec("cd " + __dirname + "/downloader/ && chmod u+x ./youtube-dl && ./youtube-dl -f 136+140 --restrict-filenames -o ../downloads/" + datetime + " " + webViewURL + " && cd ..", (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                  }
              },
              {
                  label: "Enter Picture in Picture (PiP mode)",
                  click: async () => {
                      win.webContents.executeJavaScript("enterPiPMode()")
                  }
              },
              {
                  label: "Open developer tools",
                  accelerator: "Control+Shift+I",
                  click: function () {
                    win.openDevTools()
                  }
              },
              {
                  label: "Quit",
                  accelerator: "Command+Q",
                  click: function () {
                      app.quit();
                  }
              }
        ]
        }, {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    selector: "undo:"
                },
                {
                    label: "Redo",
                    accelerator: "Shift+CmdOrCtrl+Z",
                    selector: "redo:"
                },
                {
                    type: "separator"
                },
                {
                    label: "Cut",
                    accelerator: "CmdOrCtrl+X",
                    selector: "cut:"
                },
                {
                    label: "Copy",
                    accelerator: "CmdOrCtrl+C",
                    selector: "copy:"
                },
                {
                    label: "Paste",
                    accelerator: "CmdOrCtrl+V",
                    selector: "paste:"
                },
                {
                    label: "Select All",
                    accelerator: "CmdOrCtrl+A",
                    selector: "selectAll:"
                }
        ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    win = new BrowserWindow({
        icon: __dirname + '/icons/ytblue.ico',
        webPreferences: {
          nodeIntegration: true,
          webviewTag: true,
          contextIsolation: false
        },
        width: 1200,
        height: 680
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));


    win.on('closed', () => {
        win = null
    })
    win.on('crashed', function () {
      win.reload()
    })
}


app.on('ready', () => {
    createWindow()
    exec("sudo ln -s /usr/bin/python3 /usr/local/bin/python")
  }
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('asynchronous-message', (event, currentWebViewURL) => {
  console.log(currentWebViewURL);
  webViewURL = currentWebViewURL;
})
