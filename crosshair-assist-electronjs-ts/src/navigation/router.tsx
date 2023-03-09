import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import App from "../app";

import Landing from '../screens/LandingScreen';
import HudScreen from '../screens/HudScreen';
import DisplayScreen from "../screens/DisplayScreen";
import Credits from "../screens/Credits";


const Router =  () => (
    <Routes>
        <Route
            path    = "/"
            element = {<App />}
        >
            {/* huds landing */}
            <Route
                path    = "landing"
                element = {<Landing />}
            />
                {/* displays */}
            <Route
                path    = "display"
                element = {<DisplayScreen />}
            />
                {/* credits */}
            <Route
                path    = "credits"
                element = {<Credits />}
            />
                {/* any other entry */}
            <Route
                path    = "*"
                element = {<Navigate to="huds" />}
            />
        </Route>
        <Route
            path    = "hud"
            element = {<HudScreen />}
        />
    </Routes>
);

export default Router;