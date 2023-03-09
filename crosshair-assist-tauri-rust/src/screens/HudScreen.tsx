import { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event'
import { HudScreenTypes } from "../utils/types";

const HudScreen = () => {
    const [getIsDisplay, setIsDisplay]      = useState (true);
    const [getImageId, setImageId]          = useState <number|string> (0);
    const [getImageColor, setImageColor]    = useState ("filter: blur(0%)");
    const [getImageScale, setImageScale]    = useState (1);

    useEffect (() => {
        let removeEvent: any;
        (async () => {
            removeEvent = await listen('changeImage', (evt) => {
                const {
                    ImgId,
                    color,
                    scale,
                    toggle
                } = evt.payload as HudScreenTypes;

                setImageId (ImgId);
                setImageColor (color);

                if (scale) setImageScale (scale);
                if (toggle) setIsDisplay (t => !t);
            });
        }) ();

        return () => {
            if (removeEvent) removeEvent ();
        }
    }, [getImageId]);

    return (
        <div
            className="hud_container"
        >
            <img
                alt = 'hud'
                src = {typeof getImageId === 'string' ? getImageId : `/assets/reticle-${getImageId}.png`}
                style = {{
                    width: '20vw',
                    height: '20vh',
                    filter: getImageColor,
                    transform: `scale(${getImageScale})`,
                    display: getIsDisplay ? 'flex' : 'none'
                }}
            />
        </div>
    )
}

export default HudScreen;