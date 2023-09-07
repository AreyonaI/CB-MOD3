// iframe.js
import React from 'react';


function IFrame({ iframeUrl }) {
  if (iframeUrl) {
    return (
      <iframe
        style={{ borderRadius: "12px" }}
        src={iframeUrl}
        width="100%"
        height="20%"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    );
  }
  return null;
}

export default IFrame;
