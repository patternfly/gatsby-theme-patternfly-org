import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import {
  Alert,
  PageSection,
  Title
} from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import CSSVariables from '../components/cssVariables';
import PropsTable from '../components/propsTable';
import { getId } from '../helpers/getId';
import { slugger } from '../helpers/slugger';
import { capitalize } from '../helpers/capitalize';
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
  const { cssPrefix, hideTOC, experimentalStage, optIn, hideDarkMode } = data.doc.frontmatter;
  const { componentName, navSection } = data.doc.fields;
  const { title, source, tableOfContents, htmlExamples, propComponents = [''] } = pageContext;
  const props = data.props && data.props.nodes && propComponents
    ? propComponents
      .filter(name => name !== '') // Remove default
      .map(name => {
        const propTable = data.props.nodes.find(node => node.name === name);
        if (!propTable) {
          console.warn(`PropComponent "${name}" specified in frontmatter, but not found at runtime.`);
        }

        return propTable;
      })
      .filter(Boolean)
    : undefined;

  let parityComponent = undefined;
  if (data.designDoc) {
    const { reactComponentName, coreComponentName } = data.designDoc.frontmatter;
    if (source === 'core' && reactComponentName) {
      parityComponent = `${navSection}/${reactComponentName}`;
    }
    else if (source === 'react' && coreComponentName) {
      parityComponent = `${navSection}/${coreComponentName}`;
    }
  }

  return (
    <SideNavLayout location={location} context={source} parityComponent={parityComponent}>
      {!hideTOC && (
        <PageSection className="ws-section">
          <Title size="md" className="ws-framework-title">
            {source === 'core' ? 'HTML' : capitalize(source)}
          </Title>
          <Title size="4xl" className="ws-page-title">{title}</Title>
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
          {data.designDoc &&
            <React.Fragment>
              <MDXRenderer>
                {data.designDoc.body}
              </MDXRenderer>
            </React.Fragment>
          }
          {tableOfContents.map(heading => (
            <a key={heading} href={`#${slugger(heading)}`} className="ws-toc">
              {heading}
            </a>
          ))}
          {props && (
            <a href="#props" className="ws-toc">
              Props
            </a>
          )}
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
              html={props.title && htmlExamples && htmlExamples[getId(props.title)]}
              hideDarkMode={hideDarkMode}
              navSection={navSection}
              componentName={componentName}
              {...props} />,
          ...commonComponents
        }}>
          <MDXRenderer>
            {data.doc.body}
          </MDXRenderer>
        </MDXProvider>
      </PageSection>

      {props && (
        <PageSection className="ws-section">
          <AutoLinkHeader size="h2" id="props" className="ws-title">Props</AutoLinkHeader>
          {props.map(component => (
            <React.Fragment key={component.name}>
              {component.description}
              <PropsTable caption={`${component.name} properties`} propList={component.props} />
            </React.Fragment>
          ))}
        </PageSection>
      )}

      {cssPrefix && (
        <PageSection className="ws-section">
          <AutoLinkHeader size="h2" id="css-variables" className="ws-title">CSS Variables</AutoLinkHeader>
          <CSSVariables prefix={cssPrefix} />
        </PageSection>
      )}
    </SideNavLayout>
  );
}

export const pageQuery = graphql`
  query MdxDocsPage($id: String!, $designId: String!, $propComponents: [String]!) {
    doc: mdx(id: { eq: $id }) {
      body
      frontmatter {
        cssPrefix
        hideTOC
        optIn
        experimentalStage
        hideDarkMode
      }
      fields {
        navSection
        componentName
      }
    }
    designDoc: mdx(id: { eq: $designId }) {
      body
      frontmatter {
        reactComponentName
        coreComponentName
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
    props: allComponentMetadata(filter: { name: { in: $propComponents, ne: null } }) {
      nodes {
        name
        props {
          name
          description
          required
          type {
            name
          }
          tsType {
            name
            raw
          }
          defaultValue {
            value
          }
        }
      }
    }
  }
`;
