import { useEffect, useState } from "react";
let lastBoolean = true;
const HudScreen = () => {
    const [getIsDisplay, setIsDisplay]      = useState (true);
    const [getImageId, setImageId]          = useState <number|string> (0);
    const [getImageColor, setImageColor]    = useState ("filter: blur(0%)");

    useEffect (() => {
        window.electron.on ("changeImage", (evt, data) => {
            const getImageData = data.split ("|");
            let ImageId: string|number = getImageData[0];
            if (getImageData[0].length === 1) ImageId = parseInt (getImageData[0], 10);

            setImageId (ImageId??0);
            setImageColor (getImageData[1]);
        });

        window.electron.on ("displayToggle", (evt, data) => {
            setIsDisplay (d => {
                if (lastBoolean !== !d) return !d;
                lastBoolean = d;
                return d;
            });
        });
        console.log ("sds")
    }, [getImageId]);

    return (
        <div
            className="test"
            style={{
                display: getIsDisplay ? 'flex' : 'none'
            }}
        >
            <img
                alt = 'hud'
                src = {typeof getImageId === 'number' ? require(`../img/reticle-${getImageId}.png`) : getImageId}
                style = {{
                    width: '100vw',
                    height: '100%',
                    filter: getImageColor
                }}
            />
        </div>
    )
}

export default HudScreen;