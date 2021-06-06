export type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';

declare global {
  interface Window {
    main: {
      delayResponse: (duration: number, value: string) => Promise<string>;
      readFile: (filePath: string) => Promise<string>;
      showMessageBox: (
        message: string,
        buttons?: string[],
        title?: string,
        type?: MessageBoxType
      ) => Promise<number>;
      showOpenDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
      showSaveDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
      writeFile: (filePath: string, data: string) => Promise<void>;
    };
  }
}

export async function delayResponse(duration: number, value: string): Promise<string> {
  return window.main.delayResponse(duration, value);
}

export async function readFile(filePath: string): Promise<string> {
  return window.main.readFile(filePath);
}

export async function showMessageBox(
  message: string,
  buttons?: string[],
  title?: string,
  type?: MessageBoxType
): Promise<number> {
  return window.main.showMessageBox(message, buttons, title, type);
}

export async function showOpenDialog(
  defaultPath?: string,
  title?: string
): Promise<string | undefined> {
  return window.main.showOpenDialog(defaultPath, title);
}

export async function showSaveDialog(
  defaultPath?: string,
  title?: string
): Promise<string | undefined> {
  return window.main.showSaveDialog(defaultPath, title);
}

export async function writeFile(filePath: string, data: string): Promise<void> {
  return window.main.writeFile(filePath, data);
}
