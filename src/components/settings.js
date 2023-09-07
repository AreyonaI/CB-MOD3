import React, { useState } from 'react';

import Music from '../assets/musicIcon.png';
import noMusic from '../assets/noMusic.png';
// import soundIMG from '../assets/sound.png';
import settingImg from '../assets/settings.png';

import song from '../assets/airplane-mode-yokonap-main-version-21460-03-58.mp3';
// import sound from '../assets/Mouse-Click-00-c-FesliyanStudios.com.mp3';
import '../App.css';

const Settings = () => {
  const audio = new Audio(song);
  // const sfx = new Audio(sound);

  const playMusic = () => {
    audio.play();
    audio.loop = true;
  };

  const pauseMusic = () => {
    audio.pause();
    audio.loop = false;
  };

  // const playSound = () => {
  //   sfx.play();
  // };

  // const pauseSound = () => {
  //   sfx.pause();
  // };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Close the dropdown if the user clicks outside of it
  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <div id="settings">
      <div className="dropdownS">
        <button className="settingsbtn" onClick={toggleDropdown}>
          <img src={settingImg} alt="setting image"
           data-toggle="tooltip" 
           data-placement="top" 
           title="Settings"
           animation="true"
          />
        </button>
        {dropdownVisible && (
          <div className="settings-content show">
            <img src={Music} alt="Music Icon" onClick={playMusic} />
            <img src={noMusic} alt="Music Icon" onClick={pauseMusic} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
