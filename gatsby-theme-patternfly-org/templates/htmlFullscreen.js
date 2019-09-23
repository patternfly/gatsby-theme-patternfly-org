import React from 'react';

export default ({ pageContext }) => (
  <div
    id="ws-fullscreen-example"
    dangerouslySetInnerHTML={{__html: pageContext.html || 'no fs example'}} />
);
