// credits https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

import {app} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

class Store {
    path;
    data;
    constructor(opts: any) {
      this.data = {}
      // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
      // app.getPath('userData') will return a string of the user's app data directory path.
      const userDataPath = app.getPath('userData');
      this.path = path.join(userDataPath, opts.configName + '.json');
      try {
        const dt = JSON.parse (fs.readFileSync(this.path) as any);
        this.data = dt;
      }
      catch (e) {
        // if file doesn't exist we must create one
        fs.writeFileSync (this.path, "{}");
      }
    }

  // This will just return the property on the `data` object
  get(key:string) {
    return this.data[key];
  }

  // ...and this will set it
  set(key: any, val: any) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    try{
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    }catch(e){
    }
  }
}

const store = new Store({
    configName: 'data',
    default: {}
});

// expose the class
export default store;