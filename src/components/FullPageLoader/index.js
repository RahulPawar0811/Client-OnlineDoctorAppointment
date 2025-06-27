import React from "react";
import './FullPageLoader.css'

const FullPageLoader = () => {
    return (
        <div className="wrapper">
        <div className="loader-overlay">
            <img src='/loader/Pillspinning.gif' className="loader-gif" alt="loading" />
        </div>
        </div>
    );
};

export default FullPageLoader;
