import React from 'react';
import './htmlFullscreen.css';

export default ({ pageContext }) => (
  <div
    class="ws-fullscreen-example"
    dangerouslySetInnerHTML={{__html: pageContext.html || 'No fullscreen example.'}} />
);
