import React from 'react';
import { LiveProvider, LivePreview } from 'react-live';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import { transformCode } from '../helpers/transformCode';
import './fullscreen.css';

export default ({ pageContext }) => {
  console.log('hey', pageContext, useMDXScope())
  return (
    <LiveProvider
      scope={useMDXScope()}
      code={pageContext.jsx}
      transformCode={code => transformCode(code, 'jsx')}>
      <LivePreview />
    </LiveProvider>
  );
}
