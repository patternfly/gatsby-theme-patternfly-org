import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { PageSection, Title } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import CSSVariables from '../components/cssVariables';
import './mdxTemplate.css';

const components = {
  pre: React.Fragment,
  code: Example,
};
for (let i = 1; i <= 6; i++) {
  components[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} {...props} />;
}

export default ({ data, location }) => {
  const { title, cssPrefix } = data.mdx.frontmatter;
  const sourceName = data.mdx.fields.source === 'core'
    ? 'HTML'
    : 'React';
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section-main">
        <MDXProvider components={components}>
          <Title size="md" className="ws-framework-title">{sourceName}</Title>
          <Title size="4xl">{title}</Title>
          <a href="#examples" className="ws-toc">
            Examples
          </a>
          <a href="#documentation" className="ws-toc">
            Documentation
          </a>
          {cssPrefix && (
            <a href="#css-variables" className="ws-toc">
              CSS Variables
            </a>
          )}
          <MDXRenderer>
            {data.mdx.body}
          </MDXRenderer>
          {cssPrefix && <CSSVariables prefix={cssPrefix} />}
        </MDXProvider>
      </PageSection>
    </SideNavLayout>
  );
}

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        cssPrefix
      }
      fields {
        source
      }
    }
  }
`;
