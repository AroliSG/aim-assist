import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

const App = () => {
    const [getLastElementClicked, setLastElementClicked] = useState ("Huds");
    useEffect(() => {
        document.title = 'AIM ASSIST';
    });

    const onClick = async (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        let target = evt.currentTarget;
        target.style.backgroundColor    = '#2e2d2d';
        target.style.paddingTop         = '5px';

          // returning sibling color and padding
        let prev = document.getElementById (getLastElementClicked.toLowerCase ());
        if (prev && getLastElementClicked !== target.text) {
            prev.style.backgroundColor      = '#2e2d2d';
            prev.style.paddingTop           = '0px';
        }

        setLastElementClicked (target.text);
  };

    return (
        <div className="container">
            <div>
                <nav className="navbar">
                    <Link onClick={onClick} id = 'huds' className = "link menu" to={"landing"}>Huds</Link>
                    <Link onClick={onClick} id ='displays' className="link options" to={"display"}>Displays</Link>
                    <Link onClick={onClick} id ='credits' className="link options" to={"credits"}>Credits</Link>
                </nav>
                <div className="app_container">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default App;