import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

const TopNav = ({ location, navItems }) => (
  <Nav aria-label="Nav">
    <NavList variant={'horizontal'} className="topNav">
      {navItems.map(item => (
        <NavItem key={item.link} isActive={location.pathname.includes(item.link)}>
          <Link to={item.link}>{item.text}</Link>
        </NavItem>
      ))}
    </NavList>
  </Nav>
);

export default TopNav;
