import { useEffect, useState } from "react";
import { DisplayType } from "../utils/types";

const DisplayScreen = () => {
    const [getIsLoading, setIsLoading]      = useState (true);
    const [getDisplaySet, setDisplaySet]    = useState (0);
    const [getIsReloaded, setIsReloaded]    = useState (0);
    const [getDisplayList, setDisplayList]  = useState <DisplayType['display'][]> ();

    useEffect (() => {
        setIsLoading (true);
        window.electron.invoke ("getDisplays", "").then ((display) => {
            setDisplayList (display);

            window.electron.invoke ("getDisplaySet", "").then ((idx) => {setDisplaySet (parseInt(idx, 10))});
            setIsLoading (false);
        })
    }, [getIsReloaded]);

    const Displays = (props: DisplayType) => {
        const {
            display,
            index
        } = props;
        return (
            <div className="display_box_container">
                <div className="display_view_container" style={{
                    width: '90vw'
                }}>
                    <div className="display_view_container">
                        <i className="fa fa-desktop"></i>
                        <p className="landing_title" style={{
                            marginInline: '10px',
                        }}>{display.label}</p>
                    </div>

                    <button
                        onClick   = {() => {
                                // choosing the right screen and sending it to the back
                            window.electron.send('changeDisplay', index.toString ());
                            setDisplaySet (index);
                        }}
                        className = "refresh_display_button"
                    >{getDisplaySet === index ? 'Default' : 'Set as default'}</button>
                </div>
                <div style={{
                    width: '90vw',
                    padding: '10px'
                }}>
                    <p className="landing_title">Screen Specs</p>
                    <p className="display_body">* Touch Support? {display.touchSupport}</p>
                    <p className="display_body">* Frequency? {display.displayFrequency}</p>
                    <p className="display_body">* Screen Dimensions? {display.size.width}px by {display.size.height}px </p>
                </div>
            </div>
        )
    }

    return (
        <div className="landing_container" style={{
            alignItems: 'center'
        }}>
            <div className="refresh_display">
                <p>Not showing the right displays?</p>
                <button
                    onClick   = {() => setIsReloaded (idx => idx+1)}
                    className = "refresh_display_button"
                >Refresh</button>
            </div>
            {getIsLoading ? <p>Loading.. Displays</p> : getDisplayList?.map ((display, idx) => <Displays display = {display} index = {idx}/>) }
        </div>
    )
}

export default DisplayScreen;