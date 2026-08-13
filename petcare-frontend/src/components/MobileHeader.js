import React from "react";
import "./MobileHeader.css";

const MobileHeader = () => {

  const openSidebar = () => {
    const sidebarButton = document.querySelector(".mobile-menu-btn");

    if (sidebarButton) {
      sidebarButton.click();
    }
  };

  return (
    <header className="mobile-header">

      <button
        type="button"
        className="mobile-header-menu"
        onClick={openSidebar}
        aria-label="Odpri meni"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="mobile-header-logo">
        <span className="mobile-header-paw">🐾</span>
        <span>PetCare</span>
      </div>

    </header>
  );
};

export default MobileHeader;