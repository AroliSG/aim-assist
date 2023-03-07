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

export type DisplayType = {
  index: number,
  display: {
    id: number,
    label: string,
    bounds: {
      x: number,
      y: number,
      width: number,
      height: number,
    }
    workArea: {
      x:number,
      y:number,
      width:number,
      height:number
    },
    accelerometerSupport: string,
    monochrome: boolean,
    colorDepth: number,
    colorSpace: {
      primaries: string,
      transfer: string,
      matrix: string,
      range: string
    },
    depthPerComponent:number,
    size: {
      width: number,
      height: number
    },
    displayFrequency: number,
    workAreaSize: {
      width:number,
      height:number
    },
    scaleFactor: number,
    rotation:number,
    internal:boolean,
    touchSupport: string
  }
}