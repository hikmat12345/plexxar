//libs
import React from "react";

//src
import Title from "../Title";

//scss
import "./PlexaarContainer.scss";

const PlexaarContainer = (Component) => {
  const EnhancedConponent = () => {
    return (
      <div className="plexaar-main-container dpt dpb">
        <Title />
        <div className="plexaar-main-wrapper">
          <Component />
        </div>
      </div>
    );
  };
  return EnhancedConponent;
};

export default PlexaarContainer;
