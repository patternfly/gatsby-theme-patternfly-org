import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavExpandable, Title } from '@patternfly/react-core';
import { capitalize } from '../helpers/capitalize';
import { slugger } from '../helpers/slugger';
import "./sideNav.css";

const renderNavItem = node => (
  <li key={node.path} className="pf-c-nav__item ws-sideNav-item">
    <Link
      to={node.path}
      state={{ context: node.context }} // For keeping context on shared pages
      className="pf-c-nav__link ws-sideNav-link"
      activeClassName="pf-m-active"
      >
      {node.text}
    </Link>
  </li>
);

const SideNav = ({ location, context = 'core', allPages, sideNavContexts }) => {
  const allNavItems = allPages.reduce((accum, node) => {
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
  const sideNavItems = sideNavContexts[context.replace(/-/g, '_')] || [];

  return (
    <Nav aria-label="Side Nav">
      <Title size="xl">{context}</Title>
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
