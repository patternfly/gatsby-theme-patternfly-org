/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

import { Page, PageHeader, PageSidebar } from '@patternfly/react-core';
import SideNav from '../components/sideNav';
import TopNav from '../components/topNav';
import './sideNavLayout.css';

const SideNavLayout = ({ children, location, hideSideNav, context }) => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    prInfo: envVars(name: { eq: "PR_INFO" }) {
      num
      url
    }
  }
  `);
  const siteTitle = data.site.siteMetadata.title;
  const SideBar = hideSideNav
    ? undefined
    : <PageSidebar
        nav={<SideNav location={location} context={context} />}
        className="ws-page-sidebar" />;
  const Header = (
    <PageHeader
      className="ws-page-header"
      logo={data.prInfo.num ? `PR #${data.prInfo.num}` : siteTitle}
      logoProps={{
        href: data.prInfo.url || '/'
      }}
      showNavToggle
      topNav={<TopNav location={location} context={context} />}
    />
  );

  return (
    <Page isManagedSidebar header={Header} sidebar={SideBar}>
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      {children}
    </Page>
  );
}

export default SideNavLayout;
