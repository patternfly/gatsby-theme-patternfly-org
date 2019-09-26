/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

import { Brand, Page, PageHeader, PageSidebar } from '@patternfly/react-core';
import brandImg from '../images/logo.svg';
import SideNav from '../components/sideNav';
import TopNav from '../components/topNav';
import './sideNavLayout.css';

export default ({ children, location }) => {
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
    themeOptions: sitePlugin(name: { eq: "gatsby-theme-patternfly-org" }) {
      pluginOptions {
        topNavItems {
          text
          link
        }
      }
    }
  }
  `);
  const siteTitle = data.site.siteMetadata.title;

  const Header = (
    <PageHeader
      className="ws-page-header"
      logo={data.prInfo.num ? `PR #${data.prInfo.num}` : <Brand src={brandImg} alt="PatternFly Logo" />}
      logoProps={{
        href: data.prInfo.url || '/'
      }}
      topNav={<TopNav location={location} navItems={data.themeOptions.pluginOptions.topNavItems} />}
    />
  );
  const SideBar = <PageSidebar nav={<SideNav context="core" location={location} />} className="ws-page-sidebar" />;

  return (
    <Page isManagedSidebar header={Header} sidebar={SideBar} className="ws-page pf-m-redhat-font">
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      {children}
    </Page>
  );
}
