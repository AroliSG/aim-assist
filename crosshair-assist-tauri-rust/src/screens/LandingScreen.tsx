import { useEffect, useState } from 'react';

import { Color, hexToRgb, Solver } from '../utils/colors';
import { ImageTypes } from '../utils/types';
import { getAll, getCurrent, availableMonitors } from "@tauri-apps/api/window";
import {localStorage} from '../utils/store';
import { register, unregister, isRegistered } from '@tauri-apps/api/globalShortcut';
import { emit } from "@tauri-apps/api/event";

import simpleHandler from '../utils/simpleHandler';
import convertToBase64 from '../utils/base64';



/*
    adding keybinds
    need to store it too
    last thing before publishing
*/


const Landing = () => {
  const [getKeybind, setKeybind]          = useState ({ key1: 'unbind', key2: 'unbind', key3: 'unbind' });
  const [getKeyEnabled, setKeyEnabled]    = useState (false);

  const [getMoveHud, setMoveHud]          = useState ({x:0,y:0});
  const [getMoveSpeed, setMoveSpeed]      = useState (5);

  const [getBase64Image, setBase64Image]  = useState <any[]> ([0,1,2,3,4]);
  const [getItemClicked, setItemClicked]  = useState (0);

  const [getSizeRange, setSizeRange]      = useState (1);
  const [getImageColor, setImageColor]    = useState ("blur(0%)");
  const [getColorRGB, setColorRGB]        = useState ({
    r: 0,
    g: 0,
    b: 0
  });

  useEffect (() => {
      // loading the data from the async storage
      // and then assigning it to each corresponding state
      // also looping the monitors plugged to be used later on
      // within displays page
    localStorage.load('dt', (dt) => {
      const images      = getBase64Image.concat (dt.images);

      setKeybind (dt.keybind);
      setMoveHud (dt.moveIt);
      setSizeRange (dt.scale);
      setBase64Image (images);

        // changing hud position
      availableMonitors ()
        .then ((displays) => {
            // restoring to display 0 if incase the monitor was unplugged

            // dp
          const dp = displays [dt.displayId];

            // is one monitor was removed lets reset it to 0
          dt.displayId = (dt.displayId > displays.length ? 0 : dt.displayId);

            // payload to restore the position
            // to where it was left it.
          const payload = {...dp, index: dt.displayId };
          simpleHandler.changeDefault (
            payload as any,
            dt.moveIt
          );

            // display
          dt.display.position  = dp.position;
          dt.display.size      = dp.size;

          localStorage.set('dt', dt);
        });

        // default scale
      simpleHandler.scaleImage (dt.scale, getBase64Image[getItemClicked], getImageColor);

        // default position
      simpleHandler.moveHud (dt.moveIt.x, dt.moveIt.y);

        // registering key binds
      registerKeybind ();
    });

    const hudScreen = getAll()[1];
    hudScreen.setIgnoreCursorEvents (true);
  }, []);


    // keydown event
    // we are detecting the keys that user clicks
    // once all needed is grabbed user needs to click register key binds
    // all done, user can toggle the visibility
  useEffect (() => {
    const keydown = (evt: KeyboardEvent) => {
      setKeybind (prev => {
        if(prev.key1 === 'chose') prev.key1 = evt.key;
        if(prev.key2 === 'chose') prev.key2 = evt.key;
        if(prev.key3=== 'chose') prev.key3 = evt.key;

        return {...prev};
      });
    }

    document.addEventListener ('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
    };
  }, []);

  const ImageView = (props: ImageTypes) => {
    const {
      index,
      base64
    } = props;

    return (
      <div
        className   = 'single_img_container_landing'
        style       = {{
          backgroundColor: getItemClicked === index ? 'var(--box)' : 'transparent',
        }}
        onDoubleClick = {() => {
            // making sure only the base64 is being removed
          if (typeof base64 === "string") {
            setBase64Image (prev => prev.filter (item => item !== base64));
          }
        }}

        onClick       = {evt => {
          simpleHandler.scaleImage (getSizeRange, getBase64Image[index], getImageColor);
          setItemClicked (index);
        }}
      >
        <img
          alt       = 'hud'
          className = 'landing_img'
          src       = {typeof base64=== 'string' ? base64 : `/assets/reticle-${index}.png`}
          //{/*typeof base64 === 'string' ? base64 : require(`../img/reticle-${index}.png`*/ '../assets/reticle-0.png'}
          style = {{ filter: getImageColor }}
        />
      </div>
    )
  }

  const onImageUploaded = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let img = new Image ();
    let url = window.URL;

    convertToBase64 (evt.target.files![0])
      .then ((base64) => {
        img.onload = () => {
          if (img.height > 64 || img.width > 64) {
            alert("Your image is too big, recommended is 64x64")
          }
          else {
            setBase64Image (prev => {
                // is image is duplicated we wont add it again!
              if (prev.findIndex (item => item === base64) !== -1) {
                alert("Your image is duplicated, can't handle it.");
                return prev;
              }

                // adding new image;
              return [...prev, base64]
            });

              // removing image from cpu
            img.remove ();
          }
        }
        img.onerror = () => {
          alert("Is this an image? can't handle this file!.");

            // removing image from cpu
          img.remove ();
        }

        img.src = url.createObjectURL (evt.target.files![0]);
      })
      .catch (error => {
        console.log (error)
      })
  }

  const moveIt = (aim: "y"|"x", percent: number) => {
    setMoveHud (move => {
      let x = aim === 'x' ? move.x+percent : move.x;
      let y = aim === 'y' ? move.y+percent : move.y;

      simpleHandler.moveHud (x, y);
      return {
        ...move,
        [aim]: (move[aim]+percent)
      };
    })
  }

  const changeKeybind = (key: 'key1' | 'key2' | 'key3', dt: string) => {
    setKeybind (prev => {
      return {
        ...prev,
        [key]: dt
      }
    });
  }

  const registerKeybind = () => {
    const IsNotChose = getKeybind.key1 !== 'chose' && getKeybind.key2 !== 'chose' && getKeybind.key3 !== 'chose';
    const IsNotUnbind = getKeybind.key1 !== 'unbind' && getKeybind.key2 !== 'unbind' && getKeybind.key3 !== 'unbind';

      /*
          * we are saving the data after is registered
          ? so when user enters the app, the shortcut is automatically set
      */
    if(IsNotChose && IsNotUnbind) {
      const key = `${getKeybind.key1}+${getKeybind.key2}+${getKeybind.key3}`;
        // un registering prev shortcut

      const dt    = localStorage.get ('dt');
      dt.keybind  = {
        key1: getKeybind.key1,
        key2: getKeybind.key2,
        key3: getKeybind.key3
      };

      localStorage.set('dt', dt);

      unregister (key);
      register(key, () => {
          // sending the event to toggle the visibility of the hud/crosshair
        emit('changeImage', { ImgId: getItemClicked, color:getImageColor, scale: getSizeRange, toggle: true });
      });
    }
  }

  const unregisterKeybind = () => {
      // deleting keys from database
    const dt    = localStorage.get ('dt');
    dt.keybind  = {
      key1: 'unbind',
      key2: 'unbind',
      key3: 'unbind'
    };

    localStorage.set('dt', dt);

      // un-registering keys
    unregister (`${getKeybind.key1}+${getKeybind.key2}+${getKeybind.key3}`);
    setKeybind ({ key1: "unbind", key2: "unbind", key3: "unbind" });
  }

  return (
    <div className = "landing_container">
      <div className='landing_container_image'>
        <div className = 'img-container'>
          {getBase64Image.map ((data,index) => <ImageView index = {index} base64 = {data} />)}
        </div>
        <div className='comp_container'>
          <input className='file_input_landing' type={'file'} onChange = {onImageUploaded} accept="image/*"/>
          <p className = 'landing_title' style={{ marginTop: "5px" }}>Offset manager</p>
          <div style = {{display:'flex'}}>
            <div className='landing_arrow_box'>
              <i className='fa fa-arrow-up' onClick={() => moveIt ('y', -getMoveSpeed)}></i>
              <i className='fa fa-arrow-down' onClick={() => moveIt ('y', getMoveSpeed)}></i>

              <i className='fa fa-arrow-left' onClick={() => moveIt ('x', -getMoveSpeed)}></i>
              <i className='fa fa-arrow-right' onClick={() => moveIt ('x', getMoveSpeed)}></i>
            </div>

            <div style = {{marginInline: "5px"}}>
              <p className = 'landing_title' style = {{ marginTop: "5px" }}>Coordinates</p>
              <p className = 'display_body' style = {{ marginTop: "5px" }}> - Vertically: {getMoveHud.x}px</p>
              <p className = 'display_body' style = {{ marginTop: "5px" }}> - Horizontally: {getMoveHud.y}px</p>
            </div>
          </div>
          <div style = {{
            display: 'flex',
            justifyContent:'space-between'
          }}>
            <button onClick = {() => {
                // resetting hud inputs
              simpleHandler.moveHud (0, 0);
              setMoveHud ({x:0,y:0});
            }}>Reset coords</button>
            <p className = 'landing_title' style={{ marginTop: "5px" }}>Speed: {getMoveSpeed}</p>
          </div>

          <input
            style     = {{ width:'100%' }}
            max       = {10}
            min       = {1}
            step      = {0.1}
            type      = {'range'}
            value     = {getMoveSpeed}
            onChange  = {evt => {
              const range = parseInt (evt.target.value, 10);
              setMoveSpeed (range);
            }}
          />
        </div>
      </div>

      <div className='landing_bottom_container'>
        <div className='landing_bottom_items'>
          <p className='landing_title'>Hud Color</p>
          <div className = "landing_bottom_container" style={{
            margin: 0,
            justifyContent:'center',
            alignItems:'center',
          }}>
            <input
              className = 'landing_square_picker'
              type      = {'color'}
              onChange   = {(evt) => {
                const color                          = new Color (evt.target.value);
                const solver                         = new Solver(color);
                const filter                         = solver.filter ();
                const rgb                            = hexToRgb (evt.target.value)!;

                  // changing label rgb range
                setColorRGB ({
                  r: rgb[0],
                  g: rgb[1],
                  b: rgb[2],
                });

                  // changing real time image color
                setImageColor(filter);

                  // changing hud color on the other window
                simpleHandler.scaleImage (getSizeRange, getBase64Image[getItemClicked], filter);
              }}
            />
            <p className='landing_title' style={{margin: 5}}>R: {getColorRGB.r}</p>
            <p className='landing_title' style={{margin: 5}}>G: {getColorRGB.g}</p>
            <p className='landing_title' style={{margin: 5}}>B: {getColorRGB.b}</p>
          </div>
        </div>
        <div className='landing_bottom_items' style={{
          marginInlineStart: '10px'
        }}>
          <p className='landing_title' style={{
             marginInlineStart: '10px'
          }}>Hud Scale ({getSizeRange})</p>
          <input
            style     = {{ width:'100%' }}
            max       = {3}
            min       = {1}
            step      = {0.1}
            type      = {'range'}
            value     = {getSizeRange}
            onChange  = {evt => {
              const range = parseFloat (evt.target.value);
              setSizeRange (range);
                // changing scale
                // and saving it at the same time
              simpleHandler.scaleImage (range, getBase64Image[getItemClicked], getImageColor);
            }}
          />
        </div>
      </div>
      <div className='landing_bottom_container' style = {{
        flexDirection: 'column',
        marginTop: '10px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className='landing_buttons_keybind_container'>
          <p className='landing_title'>Toggle Visibility - Hot Key - [{(getKeybind.key1 === 'unbind'||getKeybind.key2 === 'unbind'||getKeybind.key3 === 'unbind') ? 'Disabled' : 'Enabled'}]</p>
        </div>

        <div className='landing_buttons_keybind_container'>
            <button className='refresh_display_button' style={{marginInline: '0px'}} onClick={() => changeKeybind ('key1', 'chose')}>{getKeybind.key1}</button>
            <button className='refresh_display_button' onClick={() => changeKeybind ('key2', 'chose')}>{getKeybind.key2}</button>
            <button className='refresh_display_button' style={{marginInline: '0px'}} onClick={() => changeKeybind ('key3', 'chose')}>{getKeybind.key3}</button>
        </div>
        <button className='refresh_display_button' style={{margin: '5px', width: '90%'}} onClick ={registerKeybind}>REGISTER KEY BINDS</button>
        <button className='refresh_display_button' style={{ width: '90%'}} onClick ={unregisterKeybind}>UNREGISTER KEY BINDS</button>
      </div>
    </div>
  );
}

export default Landing;
