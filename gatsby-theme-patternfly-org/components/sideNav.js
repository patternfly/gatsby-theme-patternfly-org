import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { Nav, NavList, NavExpandable, NavItem } from '@patternfly/react-core';
import { capitalize } from '../helpers/capitalize';

export default ({ location }) => {
  const data = useStaticQuery(graphql`
  {
    allSitePage(filter: { context: { navSection: { ne: null } } },
                sort: { fields: context___title }) {
      nodes {
        path
        context {
          title
          navSection
        }
      }
    }
    sitePlugin(name: { eq: "gatsby-theme-patternfly-org" }) {
      pluginOptions {
        sideNavItems {
          section
          title
        }
      }
    }
  }
  `);
  const allPages = data.allSitePage.nodes.reduce((accum, node) => {
    const navSection = node.context.navSection || 'page';
    accum[navSection] = accum[navSection] || [];
    accum[navSection].push({
      text: node.context.title,
      path: node.path
    });

    return accum;
  }, {});

  return (
    <Nav aria-label="SideNav">
      <NavList>
        {data.sitePlugin.pluginOptions.sideNavItems.map(({ section, title }) => {
          if (section && allPages[section]) {
            return (
              <NavExpandable
                key={section}
                title={capitalize(section)}
                isActive={location.pathname.includes(section)}
                isExpanded={location.pathname.includes(section)}
              >
                {allPages[section].map(node => (
                  <NavItem key={node.path} isActive={location.pathname.includes(node.path)}>
                    <Link to={node.path}>{node.text}</Link>
                  </NavItem>
                ))}
              </NavExpandable>
            );
          }
          const node = allPages['root'].find(node => node.text.toLowerCase() === title.toLowerCase()) || { text: '???', path: '/' };
          return (
            <NavItem key={node.path} isActive={location.pathname.includes(node.path)}>
              <Link to={node.path}>{node.text}</Link>
            </NavItem>
          );
        })}
      </NavList>
    </Nav>
  )
}