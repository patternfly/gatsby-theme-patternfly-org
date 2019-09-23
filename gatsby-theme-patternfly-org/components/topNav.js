import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

export default ({ location, navItems }) => (
  <Nav aria-label="Nav">
    <NavList variant={'horizontal'}>
      {navItems.map(item => (
        <NavItem key={item.link} isActive={location.pathname.includes(item.link)}>
          <Link to={item.link}>{item.text}</Link>
        </NavItem>
      ))}
    </NavList>
  </Nav>
);