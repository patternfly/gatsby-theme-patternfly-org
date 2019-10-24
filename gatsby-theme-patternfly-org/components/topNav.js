import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

const TopNav = ({ location, context, navItems }) => {
  return (
    <Nav aria-label="Nav">
      <NavList variant="horizontal" className="ws-top-nav">
        {navItems.map(item => (
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
