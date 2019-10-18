import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { Nav, NavList, NavExpandable, NavItem } from '@patternfly/react-core';
import { capitalize } from '../helpers/capitalize';
import { slugger } from '../helpers/slugger';

const SideNav = ({ location }) => {
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
          text
          link
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
    <Nav aria-label="Side Nav">
      <NavList>
        {data.sitePlugin.pluginOptions.sideNavItems.map(({ section, text, link }) => {
          if (section && allPages[section]) {
            return (
              <NavExpandable
                key={section}
                title={capitalize(section)}
                isActive={location.pathname.includes(`/${slugger(section)}/`)}
                isExpanded={location.pathname.includes(`/${slugger(section)}/`)}
              >
                {allPages[section].map(node => (
                  <li key={node.path} className="pf-c-nav__item">
                    <Link to={node.path} className="pf-c-nav__link" activeClassName="pf-m-active">
                      {node.text}
                    </Link>
                  </li>
                ))}
              </NavExpandable>
            );
          }

          return (
            <li key={link} className="pf-c-nav__item">
              <Link to={link} className="pf-c-nav__link" activeClassName="pf-m-active">
                {text}
              </Link>
            </li>
          );
        })}
      </NavList>
    </Nav>
  )
}

export default SideNav;
