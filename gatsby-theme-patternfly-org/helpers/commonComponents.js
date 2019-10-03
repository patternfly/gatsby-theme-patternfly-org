import React from 'react';
import AutoLinkHeader from '../components/autoLinkHeader';

// These components replace how all elements of markdown are rendered
// TODO: more or less copy all of https://github.com/patternfly/patternfly-next/blob/master/src/patternfly/components/Content/content.scss
export const commonComponents = {
  pre: React.Fragment,
  p: props => <p style={{ marginTop: '20px', marginBottom: '20px' }}>{props.children}</p>
};
for (let i = 1; i <= 6; i++) {
  commonComponents[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} style={{ marginTop: '20px', marginBottom: '20px' }} {...props} />;
}
