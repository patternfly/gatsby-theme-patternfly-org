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
  p: (props) => <p className="ws-p" {...props} />,
  ul: (props) => <ul className="ws-ul" {...props} />,
  ul: (props) => <ul className="ws-ul" {...props} />,
  a: (props) => {
   // https://www.gatsbyjs.org/docs/gatsby-link/#reminder-use-link-only-for-internal-links
    if (props.href.includes('//') || props.href.startsWith("#")) {
      return <a {...props} />;
    }
    // Basically "withoutPrefix" since links are already prefixed coming into here
    return <Link to={props.href.replace('v4/', '')} {...props} />;
  }

};
for (let i = 1; i <= 6; i++) {
  commonComponents[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} className={`ws-title ws-h${i}`} {...props} />;
}
