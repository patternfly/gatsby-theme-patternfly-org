import React from 'react';
import { Helmet } from 'react-helmet';
import { LiveProvider, LivePreview } from 'react-live';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import { transformCode } from '../helpers/transformCode';
import './fullscreen.css';

const FullscreenMDXTemplate = ({ pageContext }) => (
  <LiveProvider
    scope={useMDXScope()}
    code={pageContext.code}
    transformCode={code => transformCode(code, 'jsx')}>
    <Helmet>
      <title>{`Fullscreen React ${pageContext.title} example`}</title>
    </Helmet>
    <LivePreview />
  </LiveProvider>
);

export default FullscreenMDXTemplate;
