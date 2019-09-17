import React from 'react';
import { Link } from 'gatsby';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import './topNav.css';

export default ({ location }) => (
  <Nav aria-label="Nav">
    <NavList variant={'horizontal'}>
      {[
        {
          text: 'Get started',
          link: '/get-started/about'
        },
        {
          text: 'Design guidelines',
          link: '/design-guidelines/styles/colors'
        },
        {
          text: 'Documentation',
          link: '/documentation/core/components/aboutmodalbox'
        },
        {
          text: 'Contribute',
          link: '/contribute/about'
        },
        {
          text: 'Get in touch',
          link: '/get-in-touch'
        },
      ].map(item => (
        <NavItem key={item.link} isActive={location.pathname.includes(item.link)}>
          <Link to={item.link}>{item.text}</Link>
        </NavItem>
      ))}
    </NavList>
  </Nav>
);