
import { getCurrent } from "@tauri-apps/api/window";

const Titlebar = () => (
    <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-button" id="titlebar-minimize" onClick = {() => getCurrent().hide()}>
            <i className="fa fa-circle" style={{color: "darkgreen"}}></i>
        </div>
        <div className="titlebar-button" id="titlebar-close" onClick = {() => getCurrent().hide()}>
            <i className="fa fa-circle" style={{color: "darkred"}}></i>
        </div>
    </div>
)


export default Titlebar;