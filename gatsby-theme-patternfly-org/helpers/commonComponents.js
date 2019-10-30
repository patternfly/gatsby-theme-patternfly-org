import React from 'react';
import { Link } from 'gatsby';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import './commonComponents.css';

// These components replace how all elements in MDX are rendered
// TODO: Copy all elements in https://github.com/patternfly/patternfly-next/blob/master/src/patternfly/components/Content/content.scss
export const commonComponents = {
  inlineCode: Example,
  pre: React.Fragment,
  p: (props) => <p className="ws-mdx-p" {...props} />,
  a: (props) => {
    // https://www.gatsbyjs.org/docs/gatsby-link/#reminder-use-link-only-for-internal-links
    if (props.href.includes('//')) {
      return <a {...props} />;
    }
    return <Link to={props.href} {...props} />;
  },
  section: (props) => <section className="ws-section" {...props} />
    
};
for (let i = 1; i <= 6; i++) {
  commonComponents[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} className={`ws-title ws-mdx-h${i}`} {...props} />;
}
