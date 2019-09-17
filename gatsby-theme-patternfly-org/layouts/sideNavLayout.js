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
      className="ws-page-header"
      logo={data.prInfo.num ? `PR #${data.prInfo.num}` : <Brand src={brandImg} alt="PatternFly Logo" />}
      logoProps={{
        href: data.prInfo.url || '/'
      }}
      topNav={<TopNav location={location} />}
    />
  );
  const SideBar = <PageSidebar nav={<SideNav context="core" location={location} />} />;

  return (
    <Page header={Header} sidebar={SideBar} className="pf-m-redhat-font">
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      {children}
    </Page>
  );
}
