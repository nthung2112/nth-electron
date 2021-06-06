import { contextBridge, ipcRenderer } from 'electron';
import { Request } from './request';

interface Entry {
  reject: Function;
  resolve: Function;
}

interface Response {
  data: any;
  id: number;
}

type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';

(() => {
  const entries: { [key: number]: Entry } = {};
  let id = 0;

  ipcRenderer.on('response', (_event, id: number, response: Response, ex: Error) => {
    // Do not include the event since it includes the sender.
    const entry = entries[id];
    delete entries[id];
    if (ex) {
      entry.reject(ex);
    } else {
      entry.resolve(response);
    }
  });

  contextBridge.exposeInMainWorld('main', {
    delayResponse: (duration: number, value: string): Promise<string> => {
      return request({ kind: 'delayResponse', duration, value });
    },
    readFile: (filePath: string): Promise<string> => {
      return request({ kind: 'readFile', filePath });
    },
    showMessageBox: (
      message: string,
      buttons?: string[],
      title?: string,
      type?: MessageBoxType
    ): Promise<number> => {
      return request({ kind: 'showMessageBox', buttons, message, title, type });
    },
    showOpenDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
      return request({ kind: 'showOpenDialog', defaultPath, title });
    },
    showSaveDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
      return request({ kind: 'showSaveDialog', defaultPath, title });
    },
    writeFile: (filePath: string, data: string): Promise<void> => {
      return request({ kind: 'writeFile', filePath, data });
    },
  });

  function request<T>(request: Request): Promise<T> {
    ++id;
    const promise = new Promise<T>((resolve, reject) => {
      entries[id] = { reject, resolve };
    });
    ipcRenderer.send('request', id, request);
    return promise;
  }
})();
