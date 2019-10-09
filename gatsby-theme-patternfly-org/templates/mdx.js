import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { PageSection, Title } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import CSSVariables from '../components/cssVariables';
import { getId } from '../helpers/getId';
import { commonComponents } from '../helpers/commonComponents';
import './mdx.css';

export default ({ data, location, pageContext }) => {
  const { title, cssPrefix, hideTOC } = data.mdx.frontmatter;
  const { source } = data.mdx.fields;
  const sourceName = source === 'core' ? 'HTML' : 'React';

  return (
    <SideNavLayout location={location}>
      {!hideTOC && (
        <PageSection className="ws-section">
          <Title size="md" className="ws-framework-title">{sourceName}</Title>
          <Title size="4xl">{title}</Title>
          {pageContext.tableOfContents.map(heading => (
            <a key={heading} href={`#${heading.toLowerCase()}`} className="ws-toc">
              {heading}
            </a>
          ))}
          {cssPrefix && (
            <a href="#css-variables" className="ws-toc">
              CSS Variables
            </a>
          )}
        </PageSection>
      )}

      <PageSection className="ws-section">
        <MDXProvider components={{
          code: props =>
            <Example
              location={location}
              source={source}
              html={props.title && pageContext.htmlExamples ? pageContext.htmlExamples[getId(props.title)] : undefined}
              {...props} />,
          ...commonComponents
        }}>
          <MDXRenderer>
            {data.mdx.body}
          </MDXRenderer>
        </MDXProvider>
      </PageSection>

      {cssPrefix && (
        <PageSection className="ws-section">
          <AutoLinkHeader size="h1" id="css-variables">CSS Variables</AutoLinkHeader>
          <CSSVariables prefix={cssPrefix} />
        </PageSection>
      )}
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
        hideTOC
      }
      fields {
        source
      }
    }
    partials: allFile(filter: { fields: { name: { ne: null } } }) {
      nodes {
        fields {
          name
          partial
        }
      }
    }
  }
`;
