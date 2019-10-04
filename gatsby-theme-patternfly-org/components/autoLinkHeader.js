import React from 'react';
import { Title } from '@patternfly/react-core';
import { LinkIcon } from '@patternfly/react-icons';
import { slugger } from '../helpers/slugger';
import './autoLinkHeader.css';

// "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
const sizes = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm'
}

export default ({
  id,
  idSuffix = '',
  size,
  headingLevel,
  children,
  ...props
}) => {
  const slug = `${slugger(children)}${idSuffix}`;

  return (
    <Title id={slug} size={sizes[size]} headingLevel={headingLevel || size} {...props}>
      <a href={`#${slug}`} className="ws-heading-anchor" tabIndex="-1" aria-label="Heading anchor icon">
        <LinkIcon style={{ verticalAlign: 'middle' }} />
      </a>
      {children}
    </Title>
  )
};
