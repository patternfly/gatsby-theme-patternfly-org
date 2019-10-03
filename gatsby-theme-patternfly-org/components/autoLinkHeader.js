import React from 'react';
import { Title } from '@patternfly/react-core';
import { LinkIcon } from '@patternfly/react-icons';
import './autoLinkHeader.css';

// TODO: cache slugs and make unique
const slugger = children => {
  const value = React.Children.toArray(children).join('');
  const whitespace = /\s/g;
  const specials = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
  return value
    .toLowerCase()
    .trim()
    .replace(specials, '')
    .replace(whitespace, '-');
};

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
