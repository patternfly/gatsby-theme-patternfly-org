import React from 'react';
import { PageSection } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';

export default ({ children, location, ...props }) => {
  console.log('props', props)
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section-main">
        {children}
      </PageSection>
    </SideNavLayout>
  );
}
