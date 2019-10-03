import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import SideNavLayout from 'gatsby-theme-patternfly-org/layouts/sideNavLayout';
import CSSVariables from 'gatsby-theme-patternfly-org/components/cssVariables';

export default ({ location }) => {
  return (
    <SideNavLayout location={location}>
      <PageSection className="ws-section">
        <Title size="md" className="ws-framework-title">HTML/React</Title>
        <Title size="4xl">Global CSS variables</Title>
      </PageSection>
      <PageSection className="ws-section">
        <CSSVariables prefix="global" />
      </PageSection>
    </SideNavLayout>
  );
}
