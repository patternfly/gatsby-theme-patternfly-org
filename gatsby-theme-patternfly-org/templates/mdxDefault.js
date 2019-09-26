import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { PageSection } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import AutoLinkHeader from '../components/autoLinkHeader';

const components = {
  pre: React.Fragment,
};
for (let i = 1; i <= 6; i++) {
  components[`h${i}`] = props => <AutoLinkHeader size={`h${i}`} {...props} />;
}

export default ({ children, location }) => {
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section-main">
        <MDXProvider components={components}>
          {children}
        </MDXProvider>
      </PageSection>
    </SideNavLayout>
  );
}
