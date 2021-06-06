import { BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs';
import { EOL } from 'os';
import { Request } from './request';

let activeWindow: BrowserWindow;

ipcMain.on('request', fulfillRequest);

export function setActiveWindow(window: BrowserWindow) {
  activeWindow = window;
}

async function fulfillRequest(event: Electron.IpcMainEvent, id: number, request: Request) {
  try {
    let response: number | string | undefined;
    switch (request.kind) {
      case 'delayResponse':
        console.log('received delayResponse:', request.duration, request.value);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, request.duration);
        });
        console.log('responding to delayResponse:', request.value);
        response = request.value;
        break;
      case 'readFile':
        response = await readFile(request.filePath);
        break;
      case 'showMessageBox':
        delete request.kind;
        response = (await dialog.showMessageBox(activeWindow, request)).response;
        break;
      case 'showOpenDialog':
        delete request.kind;
        response = (await dialog.showOpenDialog(activeWindow, request)).filePaths[0];
        break;
      case 'showSaveDialog':
        delete request.kind;
        response = (await dialog.showSaveDialog(activeWindow, request)).filePath;
        break;
      case 'writeFile':
        await writeFile(request.filePath, process.platform === 'win32' ? request.data.replace(/\\n/g, EOL) : request.data);
        break;
    }
    event.reply('response', id, response);
  } catch (ex) {
    event.reply('response', id, undefined, ex);
  }
}

function readFile(filePath: string): Promise<string> {
  return new Promise<string>((resove, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (ex, data) => {
      if (ex) {
        reject(ex);
      } else {
        resove(data);
      }
    });
  });
}

function writeFile(filePath: string, data: string): Promise<void> {
  return new Promise<void>((resove, reject) => {
    fs.writeFile(filePath, data, { encoding: 'utf8' }, (ex) => {
      if (ex) {
        reject(ex);
      } else {
        resove();
      }
    });
  });
}
