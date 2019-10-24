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
  // Put queries for Top and Side navs here for performance
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
    allSitePage(filter: { context: { navSection: { ne: null } } },
                sort: { fields: context___title }) {
      nodes {
        path
        context {
          title
          navSection
          source
        }
      }
    }
    sitePlugin(name: { eq: "gatsby-theme-patternfly-org" }) {
      pluginOptions {
        topNavItems {
          text
          path
          context
        }
        sideNav {
          core {
            section
            text
            path
          }
          react {
            section
            text
            path
          }
          get_started {
            section
            text
            path
          }
          design_guidelines {
            section
            text
            path
          }
          contribute {
            section
            text
            path
          }
        }
      }
    }
  }
  `);
  const { title } = data.site.siteMetadata;
  const { num, url } = data.prInfo;
  const { topNavItems, sideNav } = data.sitePlugin.pluginOptions;
  const SideBar = hideSideNav
    ? undefined
    : <PageSidebar
        nav={<SideNav
          location={location}
          context={context}
          allPages={data.allSitePage.nodes}
          sideNavContexts={sideNav} />}
        className="ws-page-sidebar" />;
  const Header = (
    <PageHeader
      className="ws-page-header"
      logo={num ? `PR #${num}` : title}
      logoProps={{
        href: url || '/'
      }}
      showNavToggle
      topNav={<TopNav
        location={location}
        context={context}
        navItems={topNavItems} />}
    />
  );

  return (
    <Page isManagedSidebar header={Header} sidebar={SideBar}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Page>
  );
}

export default SideNavLayout;
