type Result<T, E = Error> = Promise<ResultSync<T, E>>
type ResultSync<T, E = Error> = {
  err: E,
  data?: undefined
} | {
  err?: undefined,
  data: T
} | {
  err: E,
  data: T
}

type SscSystemBoolean = 'true' | 'false' | true | false;

interface SscSystemDialogOptions {
  type: 'open' | 'save';
  title: string;
  allowDirs?: SscSystemBoolean;
  allowFiles?: SscSystemBoolean;
  allowMultiple?: SscSystemBoolean;
  defaultPath?: string;
  defaultName?: string;
}

interface SscSystem {
  send(arg: {
    api: string,
    method: string,
    arguments?: any[]
  }): Result<any>;

  setTitle(titleName: string): Promise<void>;

  setContextMenu(value: Record<string, string>): Promise<{
    title: string
  }>;

  exit(code: number): Promise<void>;

  openExternal(url: string): Promise<void>;

  dialog(arg: SscSystemDialogOptions): Promise<string[]>;
}

interface Window {
  system: SscSystem,
  process: {
    debug: number,
    env: Record<string, string>,
    os: string,
    title: string
  }
}
