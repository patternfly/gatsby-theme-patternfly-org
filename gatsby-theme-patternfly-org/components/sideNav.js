import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { Nav, NavList, NavExpandable } from '@patternfly/react-core';
import { capitalize } from '../helpers/capitalize';
import { slugger } from '../helpers/slugger';


const renderNavItem = node => (
  <li key={node.path} className="pf-c-nav__item">
    <Link to={node.path} state={{ context: node.context }} className="pf-c-nav__link" activeClassName="pf-m-active">
      {node.text}
    </Link>
  </li>
);

const SideNav = ({ location, context = 'core' }) => {
  const data = useStaticQuery(graphql`
  {
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
          design {
            section
            text
            path
          }
        }
      }
    }
  }
  `);

  const allNavItems = data.allSitePage.nodes.reduce((accum, node) => {
    const navSection = node.context.navSection || 'page';
    accum[navSection] = accum[navSection] || [];
    accum[navSection].push({
      text: node.context.title,
      path: node.path,
      source: node.context.source,
      context
    });

    return accum;
  }, {});

  // The `context` property worked hard to get here
  context = context.replace('pages-', '');
  const sideNavItems = data.sitePlugin.pluginOptions.sideNav[context] || [];

  return (
    <Nav aria-label="Side Nav">
      <NavList>
        {sideNavItems.map(navItem => {
          const { section } = navItem;
          if (section && allNavItems[section]) {
            return (
              <NavExpandable
                key={section}
                title={capitalize(section)}
                isActive={location.pathname.includes(`/${slugger(section)}/`)}
                isExpanded={location.pathname.includes(`/${slugger(section)}/`)}
              >
                {allNavItems[section]
                  .filter(node => node.source === context || node.source === 'shared')
                  .map(renderNavItem)}
              </NavExpandable>
            );
          }

          return renderNavItem(navItem);
        })}
      </NavList>
    </Nav>
  )
}

export default SideNav;
