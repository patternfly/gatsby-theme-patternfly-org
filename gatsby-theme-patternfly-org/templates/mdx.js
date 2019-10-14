import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Alert, PageSection, Title } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import CSSVariables from '../components/cssVariables';
import { getId } from '../helpers/getId';
import { commonComponents } from '../helpers/commonComponents';
import './mdx.css';

const getWarning = state => {
  switch(state) {
    case 'early':
      return "This is an experimental feature in the early stages of testing. It's not intended for production use.";
    case 'deprecated':
      return "This experimental feature has been deprecated and will be removed in a future release. We recommend you avoid or move away from using this feature in your projects.";
    default:
      return (
        <React.Fragment>
          This experimental feature has been promoted to a <a href={`../../components/${state}`}>production-level component</a> and will be removed in a future release.
          Use the production-ready version of this feature instead.
        </React.Fragment>
      );
  }
}

export default ({ data, location, pageContext }) => {
  const { title, cssPrefix, hideTOC, experimentalStage, optIn } = data.mdx.frontmatter;
  const { source } = data.mdx.fields;
  const sourceName = source === 'core' ? 'HTML' : 'React';

  return (
    <SideNavLayout location={location}>
      {!hideTOC && (
        <PageSection className="ws-section">
          <Title size="md" className="ws-framework-title">{sourceName}</Title>
          <Title size="4xl">{title}</Title>
          {optIn && (
            <Alert
              variant="info"
              title="Opt-in feature"
              className="pf-u-my-md"
              isInline
            >
              {optIn}
            </Alert>
          )}
          {experimentalStage && (
            <Alert
              variant={experimentalStage === 'early' ? 'info' : 'warning'}
              title="Experimental feature"
              className="pf-u-my-md"
              style={{ marginBottom: 'var(--pf-global--spacer--md)' }}
              isInline
            >
              {getWarning(experimentalStage)}
            </Alert>
          )}
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
              html={props.title && pageContext.htmlExamples && pageContext.htmlExamples[getId(props.title) ]}
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
        optIn
        experimentalStage
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
