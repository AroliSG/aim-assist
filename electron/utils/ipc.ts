import { BrowserWindow, ipcMain, screen} from "electron";
import { defaultHudSize } from "./constants";
import store from "./store";

// ipc handler
const ipcHandler = (winHud: BrowserWindow, winLanding: BrowserWindow) => {
        /*
        * @[storeImage]
        ? this method is in charge of storing image base64
        ! also removes and add the images
        */
    ipcMain.on ('storeImage', (_, data) => {
        const sep       = data.split ("|");
        const evt       = sep[0];
        const base64    = sep[1];
        const dt        = store.get ("images");

        if (dt) {
            const idx = dt.findIndex ((img: string) => img === base64) as number;
                // adding image to database
            if (evt === 'add' && idx === -1) {
                dt.push (base64);
                store.set("images", dt);
            }
                // removing data
            if (evt === 'remove' && idx !== -1) {
                dt.splice (idx, 1);
                store.set("images", dt);
            }
        } else {
                // adding first image
            store.set("images", [base64]);
        }
    });

        /*
        * @[moveIt]
        ? this method is in charge of offset which move the hud where user want it!
        */
    ipcMain.on ('moveIt', (_, data) => {
        const sep           = data.split("|");
        const bounds        = screen.getAllDisplays ()[parseInt (store.get ("displayId")??0,10)].bounds;
        const width         = Math.floor(defaultHudSize.x * (parseInt(store.get('scale')??1,10)??defaultHudSize.x));
        const height        = Math.floor(defaultHudSize.y * (parseInt(store.get('scale')??1,10)??defaultHudSize.y));

            // moving items
        const x             = parseFloat(sep[0]);
        const y             = parseFloat(sep[1]);

        store.set("moveIt", {
            x,
            y
        });

        winHud.setBounds({
            x: Math.floor ((bounds.x + bounds.width/2) - (width/2) + x),
            y: Math.floor ((bounds.y + bounds.height/2) - (height/2) + y),
          });
    });

        /*
        * @[images]
        ? this method is in charge of changing the image of hud
        */
    ipcMain.on ('images', (_, Id) => winHud.webContents.send ("changeImage", Id));

    /*
        * @[changeDisplay]
        ? this method is in charge of moving the hud between screens/displays
        ! only if user have more the 1 screen
    */
    ipcMain.on ('changeDisplay', (_, args) => {
    const idx       = parseInt (args, 10);
    const display   = screen.getAllDisplays ()[idx];
    const size      = winHud.getSize ();

        // moving hud to last coordinates
    const x             = parseInt((store.get('moveIt') && store.get('moveIt').x)??0,10);
    const y             = parseInt((store.get('moveIt') && store.get('moveIt').y)??0,10);

    winHud.setBounds({
        x: Math.floor ((display.bounds.x + display.bounds.width/2) - (size[0]/2) + x),
        y: Math.floor ((display.bounds.y + display.bounds.height/2) - (size[1]/2) + y),
    });

    store.set ("displayId", idx.toString());
    });

    /*
        * @[bigify]
        ? this method is in charge of scaling the hud
        ? hudSize * range will scale the hud 5x bigger
        TODO: make hud scaling motionless
    */
    ipcMain.on ('bigify', (_, args) => {
    const range       = parseFloat (args);
    const width       = Math.floor(defaultHudSize.x * range);
    const height      = Math.floor(defaultHudSize.y * range);

    const bounds  = screen.getAllDisplays ()[parseInt (store.get ("displayId")??0,10)].bounds;

        // saving data
    store.set ("scale", args);

        // centering image on scaling
        winHud.setBounds({
        x: Math.floor ((bounds.x + bounds.width/2) - (width/2)),
        y: Math.floor ((bounds.y + bounds.height/2) - (height/2)),
    });

        // scaling image
        winHud.setSize (
            // x scaling
            width,
            // y scaling
            height
        );
    });
}

    // data to be invoke
    // invoking all displays
ipcMain.handle ("getDisplays", () => screen.getAllDisplays ());

  // invoking default display
ipcMain.handle ("getDisplaySet", () => store.get("displayId")??0);

  // invoking scale
ipcMain.handle ("getScale", () => store.get('scale')??1);

    // invoking all images saved in database
ipcMain.handle ("getImages", () => store.get('images')??[]);

    // invoking last coords
ipcMain.handle ("getCoords", () => store.get('moveIt')??0);

export default ipcHandler;