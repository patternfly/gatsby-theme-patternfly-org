import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { Nav, NavList, NavExpandable, NavItem } from '@patternfly/react-core';
import { capitalize } from '../helpers/capitalize';

export default ({ context, location }) => {
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
        {['components', 'layouts', 'utilities', 'demos', 'experimental'].map(navSection => (
          <NavExpandable
            key={navSection}
            title={capitalize(navSection)}
            isActive={location.pathname.includes(navSection)}
            isExpanded={location.pathname.includes(navSection)}
          >
            {allPages[navSection].map(node => (
              <NavItem key={node.path} isActive={location.pathname.includes(node.path)}>
                <Link to={node.path}>{node.text}</Link>
              </NavItem>
            ))}
          </NavExpandable>
        ))}
      </NavList>
    </Nav>
  )
}