declare global {
    interface Window {
      electron: {
        send: (evt: string, args: string) => void,
        on: (evt: string, cb: (evt: any, ...args: any[]) => void) => void,
        once: (evt: string, cb: (evt: any, ...args: any[]) => void) => void,
        removeListener: (event: any, listener: (...args: any[]) => void) => void,
        invoke: (evt: string, args: string) => Promise <any>
      };
    }
}

export type ImageTypes = {
  index: number,
  base64: number|string
}

export type HudScreenTypes = {
  ImgId: number;
  scale: number;
  color: string;
  toggle: boolean;
}

export type DisplayType = {
  index?: number;
  name: string;
  position: {
    type: string;
    x: number;
    y: number;
  };
  size: {
    type: string;
    width: number;
    height: number;
  };
}


export type defaultJsonType = {
  images: string[];
  moveIt: {
    x: number;
    y: number;
  };
  displayId: number;
  scale: number;
  keybind:{
    key1: string;
    key2: string
    key3: string;
  };
  display: {
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  }
}