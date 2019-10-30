import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

const TopNav = ({ location, context, navItems }) => {
  return (
    <Nav aria-label="Nav">
      <NavList variant="horizontal" className="ws-top-nav">
        {navItems.map(({ path, text, contexts }) => (
          (path.includes('http'))
            ? (
              <NavItem
                key={path}
                isActive={location.pathname.includes(path) || (contexts || []).includes(context)}
                >
                <a href={path} className="ws-topnav-blog" target="_blank">{text}</a>
              </NavItem>
            )
            : (
              <NavItem
                key={path}
                isActive={location.pathname.includes(path) || (contexts || []).includes(context)}
                >
                <Link to={path}>{text}</Link>
              </NavItem>
            )
        ))}
      </NavList>
    </Nav>
  );
}
  

export default TopNav;
