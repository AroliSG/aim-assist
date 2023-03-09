import { Store } from "tauri-plugin-store-api";
import { defaultJsonType } from "./types";

const map = new Map ();
const store = new Store(`settings.dat`);

const defaultJson = {
    images: [],
    moveIt: {
        x:0,
        y:0
    },
    displayId: 0,
    scale:1,
    keybind:{
        key1: "unbind",
        key2: "unbind",
        key3:"unbind"
    },
    display: {
        position: {
          x: 0,
          y: 0
        },
        size: {
            width: 0,
            height: 0
        }
    }
}

export const localStorage =  {
        // loading all data before initializing
    load: async (name: string, listener: (dt: defaultJsonType) => void) => {
        const storeExists   = await store.has(name);
        if (storeExists) {
            const dt = await store.get (name);
            map.set (name, dt);
            listener(dt as defaultJsonType);
        }
        else {
            await store.set (name, defaultJson);
            await store.save ();
            map.set (name, defaultJson);
            listener (defaultJson)
        }
    },
    get: (name: string): defaultJsonType => {
        return map.get (name);
    },
    set: (name: string, dt: defaultJsonType) => {
        store.set (name, dt);
        store.save ();

        return map.set (name, dt);
    },
    save: async () => {
        await store.save ();
    }
}
