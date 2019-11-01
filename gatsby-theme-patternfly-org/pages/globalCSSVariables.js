import React from 'react';
import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import SideNavLayout from '../layouts/sideNavLayout';
import CSSVariables from '../components/cssVariables';
import AutoLinkHeader from '../components/autoLinkHeader';

export default ({ location, pageContext }) => {
  // We don't know which SideNav to render so we need state
  // See: https://www.gatsbyjs.org/docs/location-data-from-props/#example-of-providing-state-to-a-link-component
  let context = location.state && location.state.context
    ? location.state.context
    : pageContext.source;
  // There is no "org" context for this page
  if (["org", "shared"].includes(context)) {
    context = 'core';
  }

  return (
    <SideNavLayout location={location} context={context}>
      <PageSection className="ws-section ws-design-content" variant={PageSectionVariants.light}>
        <Title size="md" className="ws-framework-title">HTML/React</Title>
        <Title size="4xl">Global CSS variables</Title>
        <AutoLinkHeader size="h2">About CSS variables</AutoLinkHeader>
        <p>The CSS variable system is a two-layer theming system where global variables inform component variables.</p>
        <AutoLinkHeader size="h2">Global variables</AutoLinkHeader>
        <p>Global variables define and enforce global style elements (like values for color, spacing, and font size) across the entire system.</p>
        <p>Global variables follow this formula:</p><code>--pf-global--concept--PropertyCamelCase--modifier--state</code>
        <p>Where...</p>
        <ul>
          <li>A <code>concept</code> is something like a <code>spacer</code> or <code>main-title</code>.</li>
          <li>A <code>PropertyCamelCase</code> is something like <code>BackgroundColor</code> or <code>FontSize</code>.</li>
          <li>A <code>modifier</code> is something like <code>sm</code> or <code>lg</code>.</li>
          <li>A <code>state</code> is something like <code>hover</code> or <code>expanded</code>.</li>
        </ul>
        <AutoLinkHeader size="h2">Component variables</AutoLinkHeader>
        <p>Component variables are used to define custom properties at the component-level. Component variables are always defined by global variables.</p>
        <p>Component variables follow this formula:</p><code>--pf-c-block__element--modifier--state--breakpoint--pseudo-element--PropertyCamelCase</code>
        <p>Where...</p>
        <ul>
          <li><code>pf-c-block</code> refers to the block, usually the component or layout name, like <code>pf-c-alert</code>.</li>
          <li><code>__element</code> refers to the element inside of the block, like <code>__title</code>.</li>
          <li><code>modifier</code> is prefixed with<code>-m</code> and refers to a modifier class such as <code>.pf-m-danger</code>.</li>
          <li><code>state</code> is something like <code>hover</code> or <code>active</code>.</li>
          <li><code>breakpoint</code> is a media query breakpoint such as <code>sm</code> for <code>$pf-global--breakpoint--xs</code>.</li>
          <li><code>pseudo-element</code> is either <code>before</code> or <code>after</code>.</li>
        </ul>
        <AutoLinkHeader size="h2">Using the variable system</AutoLinkHeader>
        <p>
          PatternFly 4 styles provide a default starting point. You can use the variable system to make adjustments to that default styling.
          When you change one or more elements, you should package those values into a new SCSS stylesheet to replace the default styling.
        </p>
        <AutoLinkHeader size="h2">Global CSS variables</AutoLinkHeader>
        <CSSVariables prefix="global" />
      </PageSection>
    </SideNavLayout>
  );
}
