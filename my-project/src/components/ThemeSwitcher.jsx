// ThemeSwitcher.js
import React, { useState } from "react";
import { BsSun, BsMoon} from 'react-icons/bs';
const ThemeSwitcher = ({ setTheme }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-light" ? "vs-dark" : "vs-light"));
    setIsDarkMode((prevDarkMode) => !prevDarkMode);
  };

  return (
    <button className="text-output" onClick={changeTheme}>
      {isDarkMode ?<BsSun />:<BsMoon/> }
     
    </button>
  );
};

export default ThemeSwitcher;
