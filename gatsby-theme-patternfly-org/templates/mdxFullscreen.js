import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Example from '../components/example';

const components = {
  pre: React.Fragment,
  Example: props => <Example isFullscreen {...props} />
};

export default ({ pageContext }) => {
  return (
    <MDXProvider components={components}>
      <MDXRenderer>
        {pageContext.mdxBody}
      </MDXRenderer>
    </MDXProvider>
  );
}
