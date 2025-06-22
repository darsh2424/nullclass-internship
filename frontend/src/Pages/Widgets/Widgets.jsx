import React, { useEffect } from "react";
import "./widget.css";
import SearchIcon from "@mui/icons-material/Search";

const Widgets = () => {
  useEffect(() => {
    // Load Twitter script if it's not already on the page
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load(); // Re-initialize
    }
  }, []);

  return (
    <div className="widgets">
      {/* Optional search UI */}
      {/* <div className="widgets__input">
        <SearchIcon className="widget__searchIcon" />
        <input placeholder="Search Twitter" type="text" />
      </div> */}

      <div className="widgets__widgetContainer">
        <h2>What's Happening</h2>

        {/* Tweet Embed */}
        <blockquote className="twitter-tweet">
          <a href="https://twitter.com/anyuser/status/1935357512011890815"></a>
        </blockquote>

        {/* Timeline Embed */}
        <a
          className="twitter-timeline"
          data-height="400"
          href="https://x.com/OpenAI"
        >
          Tweets by OpenAI
        </a>
      </div>
    </div>
  );
};

export default Widgets;
