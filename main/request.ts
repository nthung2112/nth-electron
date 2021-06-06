import { MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron';

type WithKind<T, K> = T & { kind?: K };
export type Request =
  | WithKind<{ filePath: string }, 'readFile'>
  | WithKind<{ duration: number; value: string }, 'delayResponse'>
  | WithKind<MessageBoxOptions, 'showMessageBox'>
  | WithKind<OpenDialogOptions, 'showOpenDialog'>
  | WithKind<SaveDialogOptions, 'showSaveDialog'>
  | WithKind<{ filePath: string; data: string }, 'writeFile'>;
