import { BrowserWindow, ipcMain, screen , globalShortcut} from "electron";
import { defaultHudSize } from "./constants";
import store from "./store";



const map = new Map ();

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
        }
            // adding first image
        else store.set("images", [base64]);
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
            * @[changeKeybind]
            ? this method is in charge of saving the keybind
        */
    ipcMain.on ('changeKeybind', (_, dt) => {
        const sep = dt.split("|");
        store.set('keybind', {
            key1: sep[0],
            key2: sep[1],
            key3: sep[2]
        })

        const isKeyBind = sep[0] !== 'unbind' && sep[1] !== 'unbind' && sep[2] !== 'unbind';

            // un-registering last shortcut
        const shortcut = `${sep[0]}+${sep[1]}+${sep[2]}`;
        if (map.has ('globalShortcut'))globalShortcut.unregister (map.get('globalShortcut'));
        if (isKeyBind) {
                // saving new shortcut
                // also sending to hud
            globalShortcut.register (shortcut, () => winHud.webContents.send ("displayToggle", null));
            map.set ('globalShortcut', shortcut);
        }
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


        // data to be invoke
        // invoking all displays
    ipcMain.handle ("getDisplays", () => screen.getAllDisplays ());

    // invoking default display
    ipcMain.handle ("getDisplaySet", () => store.get("displayId")??0);

    ipcMain.handle ("getLandingData", () => {
    const binds = store.get('keybind') ?? { key1: 'unbind', key2: 'unbind', key3: 'unbind' };
    const isKeyBind = binds.key1 !== 'unbind' && binds.key2 !== 'unbind' && binds.key3 !== 'unbind';

    if (isKeyBind) {
        const shortcut = `${binds.key1}+${binds.key2}+${binds.key3}`;
        map.set('globalShortcut', shortcut);
        globalShortcut.register (shortcut, () => winHud.webContents.send ("displayToggle", null));
    }

    return (
            // invoking last coords
        JSON.stringify(store.get('moveIt')??{x:0, y:0}) + '|' +

            // invoking scale
        (store.get('scale')??1) + '|' +

            // invoking all images saved in database
        JSON.stringify(store.get('images')??[]) + "|" +

            // invoking binds
        JSON.stringify(binds)
    )
    });

}

export default ipcHandler;