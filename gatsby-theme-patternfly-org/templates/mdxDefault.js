import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { PageSection } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import { commonComponents } from '../helpers/commonComponents';
import './mdx.css';

const MDXDefaultTemplate = ({ children, location }) => {
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section">
        <MDXProvider components={commonComponents}>
          {children}
        </MDXProvider>
      </PageSection>
    </SideNavLayout>
  );
}

export default MDXDefaultTemplate;
