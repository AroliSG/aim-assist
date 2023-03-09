import { PhysicalPosition, getAll, getCurrent, LogicalPosition, availableMonitors } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import { localStorage } from "./store";
import { DisplayType } from "./types";

const hudSize = {x: 200, y: 200 }

const simpleHandler = {
        // moving the crosshair
    moveHud: (x: number, y: number) => {
        const hudScreen = getAll()[1];
        if (hudScreen) {
            const dt =  localStorage.get ('dt');
            dt.moveIt.x = x;
            dt.moveIt.y = y;

            localStorage.set ('dt', dt);
            hudScreen.setPosition (
                new LogicalPosition(
                    (dt.display!.position.x + dt.display!.size.width/2) - (hudSize.x/2) + x,
                    (dt.display!.position.y + dt.display!.size.height/2) - (hudSize.y/2) + y
                )
            );
        }
    },

        // default crosshair scale
    scaleImage: (scale: number, ImgId: number, color: string) => {
        const dt = localStorage.get ('dt');
        emit('changeImage', { ImgId, color, scale });

        dt.scale = scale;
        localStorage.set ('dt', dt);
    },

        // default crosshair position
    changeDefault: (screen: DisplayType, move?: {x:number,y:number}) => {
        const hudScreen = getAll()[1];

            // if extra moves were saved before shut down.
        if (!move) move = {x:0,y:0};
        if (hudScreen) {
            hudScreen.setPosition (
                new LogicalPosition(
                    (screen.position.x + screen.size.width/2) - (hudSize.x/2) + move.x,
                    (screen.position.y + screen.size.height/2) - (hudSize.y/2) + move.y
                )
            );

            const dt =  localStorage.get ('dt');
            dt.displayId = screen.index!;

            localStorage.set ('dt', dt);
        }
    }
}

export default simpleHandler;