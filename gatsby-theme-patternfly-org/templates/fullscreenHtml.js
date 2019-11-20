import React from 'react';
import { Helmet } from 'react-helmet';
import './fullscreen.css';

const FullscreenHTMLTemplate = ({ pageContext }) => (
  <div
    class="ws-fullscreen-example"
    dangerouslySetInnerHTML={{__html: pageContext.code || 'No fullscreen example.'}}
  >
    <Helmet>
      <title>{`Fullscreen HTML ${pageContext.title} example`}</title>
    </Helmet>
  </div>
);

export default FullscreenHTMLTemplate;
