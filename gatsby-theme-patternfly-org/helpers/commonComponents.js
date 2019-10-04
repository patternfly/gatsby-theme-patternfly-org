import React from 'react';
import AutoLinkHeader from '../components/autoLinkHeader';
import Example from '../components/example';
import './commonComponents.css';

// These components replace how all elements of markdown are rendered
// TODO: more or less copy all of https://github.com/patternfly/patternfly-next/blob/master/src/patternfly/components/Content/content.scss
export const commonComponents = {
  inlineCode: props => <Example>{props.children}</Example>,
  p: props => <p className="ws-content-p">{props.children}</p>,
  pre: React.Fragment
};
for (let i = 1; i <= 6; i++) {
  commonComponents[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} className="ws-title" {...props} />;
}
