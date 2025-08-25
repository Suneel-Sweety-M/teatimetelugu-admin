import { useState } from "react";
import "./toggle.css";

const Toggle = () => {
  const [lang, setLang] = useState("en");

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  const handleToggleChange = () => {
    setLang(lang === "en" ? "te" : "en");
  };

  return (
      <div className="switch-options">
        <div className="toggle-version">
          <div className="toggle-container" onClick={handleToggleChange}>
            <div className={`toggle-track ${lang === "te" ? "active" : ""}`}>
              <div className="toggle-thumb"></div>
            </div>
            <div className="language-labels">
              <span className={lang === "en" ? "active" : ""}>EN</span>
              <span className={lang === "te" ? "active" : ""}>TE</span>
            </div>
          </div>
        </div>

        <div className="select-version">
          <div className="custom-select-wrapper">
            <div className="custom-select">
              <select value={lang} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="te">Telugu</option>
              </select>
              <span className="custom-arrow"></span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Toggle;
