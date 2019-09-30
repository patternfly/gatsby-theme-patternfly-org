import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { PageSection } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import { commonComponents } from '../helpers/getCommonComponents';

export default ({ children, location }) => {
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section-main">
        <MDXProvider components={commonComponents}>
          {children}
        </MDXProvider>
      </PageSection>
    </SideNavLayout>
  );
}
