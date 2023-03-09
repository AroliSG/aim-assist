import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { defaultJsonType, DisplayType } from "../utils/types";
import { availableMonitors, currentMonitor, getAll, LogicalPosition } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import simpleHandler from "../utils/simpleHandler";
import { localStorage } from "../utils/store";

const DisplayScreen = () => {
    const [getIsLoading, setIsLoading]      = useState (true);
    const [getDisplaySet, setDisplaySet]    = useState (0);
    const [getIsReloaded, setIsReloaded]    = useState (0);
    const [getDisplayList, setDisplayList]  = useState <DisplayType[]> ();

    useEffect (() => {
        (async() => {
            setIsLoading (true);
            const dt = localStorage.get ('dt') as defaultJsonType;
            setDisplaySet(dt.displayId);

            availableMonitors().then (displays => {
                setDisplayList (displays as any);
                setIsLoading (false);
            })
        })();
    }, [getIsReloaded]);

    const Displays = (props: DisplayType) => {
        const {
            name,
            size,
            index,
        } = props;

        return (
            <div className="display_box_container">
                <div className="display_view_container" style={{
                    width: '90vw'
                }}>

                    <div className="display_view_container">
                        <i className="fa fa-desktop"></i>
                        <p
                            className   = "landing_title"
                            style       = {{
                                marginInline: '10px',
                            }}
                        >{name}</p>
                    </div>

                    <button
                        onClick   = {() => {
                            simpleHandler.changeDefault (props);
                            setDisplaySet (index!);
                        }}
                        className = "refresh_display_button"
                    >{getDisplaySet === index ? 'Default' : 'Set as default'}</button>
                </div>

                <div style = {{
                    width: '90vw',
                    padding: '10px'
                }}>
                    <p className="landing_title">Screen Specs</p>
                    <p className="display_body">* Touch Support? Undefined</p>
                    <p className="display_body">* Frequency? Undefined</p>
                    <p className="display_body">* Screen Dimensions? {size.width}px by {size.height}px</p>
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

            {getIsLoading ? <p>Loading.. Displays</p> : getDisplayList?.map ((display, idx) => (
                <Displays
                    index       = {idx}
                    name        = {display.name}
                    size        = {display.size}
                    position    = {display.position}
                />))}
        </div>
    )
}

export default DisplayScreen;