import React from 'react';
import { Helmet } from 'react-helmet';
import { LiveProvider, LivePreview } from 'react-live';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import { transformCode } from '../helpers/transformCode';
import './fullscreen.css';

const FullscreenMDXTemplate = ({ pageContext }) => (
  <main className="ws-site-root">
    <Helmet>
      <title>{pageContext.title}</title>
    </Helmet>
    <LiveProvider
      scope={useMDXScope()}
      code={pageContext.code}
      transformCode={code => transformCode(code, 'jsx')}
    >
      <LivePreview />
    </LiveProvider>
  </main>
);

export default FullscreenMDXTemplate;
