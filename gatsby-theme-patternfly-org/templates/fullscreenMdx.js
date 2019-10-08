import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { transformCode } from '../helpers/transformCode';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import './fullscreen.css';

export default ({ pageContext }) => {
  console.log('hey', pageContext, useMDXScope())
  return (
    <MDXProvider components={{
      pre: React.Fragment,
      code: props => (
        <LiveProvider
          scope={useMDXScope()}
          code={props.children.toString()}
          transformCode={code => transformCode(code, 'jsx')}>
          <LivePreview />
        </LiveProvider>
      )}}>
      <MDXRenderer>
        {pageContext.mdxBody}
      </MDXRenderer>
    </MDXProvider>
  );
}
