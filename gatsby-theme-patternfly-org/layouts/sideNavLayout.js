/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { Helmet } from 'react-helmet';

import '@patternfly/react-core/dist/styles/base.css';
import { Brand, Page, PageHeader, PageSidebar, Nav, NavList, NavItem } from '@patternfly/react-core';
import brandImg from '../images/logo.svg';
import SideNav from '../components/sideNav';
import TopNav from '../components/topNav';

export default ({ children, location }) => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    prInfo: envVars(name: { eq: "PR_INFO" }) {
      num
      url
    }
  }
  `);
  const siteTitle = data.site.siteMetadata.title;

  const Header = (
    <PageHeader
      style={{ backgroundColor: 'black' }}
      logo={data.prInfo.num ? `PR #${data.prInfo.num}` : <Brand src={brandImg} alt="PatternFly Logo" />}
      logoProps={{
        href: data.prInfo.url || '/'
      }}
      showNavToggle
      topNav={<TopNav location={location} />}
    />
  );
  const SideBar = <PageSidebar nav={<SideNav context="core" location={location} />} />;

  return (
    <Page page header={Header} sidebar={SideBar} isManagedSidebar>
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      {children}
    </Page>
  );
}
