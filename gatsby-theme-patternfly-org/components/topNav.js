import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

const TopNav = ({ location, context }) => {
  const data = useStaticQuery(graphql`
  {
    themeOptions: sitePlugin(name: { eq: "gatsby-theme-patternfly-org" }) {
      pluginOptions {
        topNavItems {
          text
          path
          context
        }
      }
    }
  }
  `);

  return (
    <Nav aria-label="Nav">
      <NavList variant="horizontal" className="ws-top-nav">
        {data.themeOptions.pluginOptions.topNavItems.map(item => (
          <NavItem
            key={item.path}
            isActive={location.pathname.includes(item.path) || context === item.context}
            >
            <Link to={item.path}>{item.text}</Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}
  

export default TopNav;
