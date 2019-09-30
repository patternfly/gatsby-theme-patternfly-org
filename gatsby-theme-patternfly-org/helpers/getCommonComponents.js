import React from 'react';
import AutoLinkHeader from '../components/autoLinkHeader';

export const commonComponents = {
  pre: React.Fragment,
};
for (let i = 1; i <= 6; i++) {
  commonComponents[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} {...props} />;
}
