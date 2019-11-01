import React from "react";
import { PageSection, Title } from "@patternfly/react-core";
import SideNavLayout from "../layouts/sideNavLayout";
import AutoLinkHeader from "../components/autoLinkHeader";

export default ({ location, pageContext }) => {
  // We don't know which SideNav to render so we need state
  // See: https://www.gatsbyjs.org/docs/location-data-from-props/#example-of-providing-state-to-a-link-component
  let context =
    location.state && location.state.context
      ? location.state.context
      : pageContext.source;
  // There is no "org" context for this page
  if (["org", "shared"].includes(context)) {
    context = "core";
  }

  return (
    <SideNavLayout location={location} context={context}>
      <PageSection className="ws-section ws-design-content">
        <Title size="md" className="ws-framework-title">
          HTML/React
        </Title>
        <Title size="4xl">Red Hat font in PatternFly</Title>
        <p className="ws-mdx-p">
          PR -{" "}
          <a href="https://github.com/patternfly/patternfly-next/pull/1813">
            https://github.com/patternfly/patternfly-next/pull/1813
          </a>
        </p>
        <p className="ws-mdx-p">
          Full list of changes -{" "}
          <a href="https://github.com/patternfly/patternfly-next/pull/1813/files">
            https://github.com/patternfly/patternfly-next/pull/1813/files
          </a>
        </p>
        <p className="ws-mdx-p">
          Available in{" "}
          <a href="https://github.com/patternfly/patternfly-next/releases/tag/v2.18.0">
            v2.18.0
          </a>
        </p>
        <AutoLinkHeader size="h2">To opt-in to the new font</AutoLinkHeader>
        <p className="ws-mdx-p">
          PatternFly has introduced two new fonts - Red Hat Text and Red Hat
          Display which replace the current Overpass font. These new fonts are
          feature characteristics which improve the performance and legibility
          at any type size. They are also designed to support more browsers than
          the current Overpass font.
        </p>
        <p className="ws-mdx-p">
          The new font will be available in parallel with the current Overpass
          font to give teams an easier transition period.
        </p>
        <p className="ws-mdx-p">
          Simply add the class <code>.pf-m-redhat-font</code> to an element that
          wraps your application (ideally <code>&lt;html&gt;</code> or{" "}
          <code>&lt;body&gt;)</code> to adopt the CSS changes that introduce the
          Red Hat font into PatternFly.
        </p>
        <AutoLinkHeader size="h2">
          Changes introduced from this PR that are available whether you opt-in
          to the new font or not:
        </AutoLinkHeader>
        <ul>
          <li>
            The Red Hat font has 2 variations ("text" and "display"), and this
            PR adds font families for both variations. Each font variation was
            designed with specific characteristics which allow them to perform
            best in their specific contexts. For more information, see the
            [RedHatOfficial/RedHatFont
            repo](https://github.com/RedHatOfficial/RedHatFont/).
          </li>
          <ul>
            <li>
              "RedHatText": uses a smaller/lighter character with hinting that
              enables it to fit the pixel grid well at smaller sizes like body
              text.
            </li>
            <ul>
              <li>
                <code>--pf-global--FontFamily--redhatfont--sans-serif</code>
              </li>
              <li>Font weights</li>
              <ul>
                <li>400 (normal)</li>
                <li>700 (bold)</li>
              </ul>
            </ul>
            <li>
              "RedHatDisplay": uses a wider/heavier character which matches our
              logo and is designed to be used for headings and other large
              sizes.
            </li>
            <ul>
              <li>
                <code>
                  --pf-global--FontFamily--redhatfont--heading--sans-serif
                </code>
              </li>
              <li>Font weights</li>
              <ul>
                <li>300 (light - rarely used)</li>
                <li>400 (normal)</li>
                <li>700 (bold)</li>
              </ul>
            </ul>
          </ul>
          <li>Adds new global variable for use with RedHatDisplay</li>
          <ul>
            <li>
              <code>--pf-global--FontFamily--heading--sans-serif</code>
            </li>
          </ul>
          <li>
            No longer using a semi-bold font weight with
            RedHatDisplay/RedHatText
          </li>
          <li>
            Adds new variable for "bold" for use with RedHatDisplay/RedHatText
            since the bold value was 600 with Overpass, and is now 700 with
            RedHatDisplay/RedHatText
          </li>
          <ul>
            <li>
              <code>--pf-global--FontWeight--redhatfont--bold</code>
            </li>
          </ul>
          <li>
            Changes the value for <code>--pf-global--FontSize--xl</code> from
            21px to 20px
          </li>
          <ul>
            <li>Works better on a mathematical scale for relative sizing</li>
          </ul>
        </ul>
        <AutoLinkHeader size="h3">
          The following CSS changes are introduced when you apply
          <code>.pf-m-redhat-font</code>:
        </AutoLinkHeader>
        <AutoLinkHeader size="h4">Global variables:</AutoLinkHeader>
        <ul>
          <li>SansSerif font var changes from Overpass to RedHatText</li>
          <li>Heading font var defined as RedHatDisplay</li>
          <li>Bold font var changes from 600 to 700</li>
          <li>Semi-bold font var maps to the bold font var</li>
          <li>Link font-weight changes from semi-bold to normal</li>
        </ul>
        <AutoLinkHeader size="h4">Title component</AutoLinkHeader>
        <ul>
          <li>Font-family changes to RedHatDisplay</li>
          <li>
            The large (<code>.pf-m-lg</code>) and medium (<code>.pf-m-md</code>)
            variations’ font-weight changes from semi-bold to normal
          </li>
        </ul>
        <AutoLinkHeader size="h4">Expandable component</AutoLinkHeader>
        <ul>
          <li>Toggle font-weight changes from semi-bold to normal</li>
        </ul>
        <AutoLinkHeader size="h4">Empty state component</AutoLinkHeader>
        <ul>
          <li>
            Title font-size is now defined as{" "}
            <code>--pf-global--FontSize--xl</code> (20px)
          </li>
        </ul>
        <AutoLinkHeader size="h4">Content component</AutoLinkHeader>
        <ul>
          <li>
            <code>&lt;h1&gt;</code> - <code>&lt;h6&gt;</code> use RedHatDisplay
          </li>
          <li>
            <code>&lt;h2&gt;</code> line-height changes from{" "}
            <code>--pf-global--LineHeight--sm</code> (1.3) to{" "}
            <code>--pf-global--LineHeight--md</code> (1.5)
          </li>
          <li>
            <code>&lt;blockquote&gt;</code> font-weight changes from light to
            normal
          </li>
          <li>
            <code>&lt;h4&gt;</code>, <code>&lt;h5&gt;</code>, and{" "}
            <code>&lt;h6&gt;</code> font-weight changes from semi-bold to normal
          </li>
        </ul>
        <AutoLinkHeader size="h4">Card component</AutoLinkHeader>
        <ul>
          <li>Card header font-weight is defined as bold</li>
          <li>Card header font-family is defined as RedHatText</li>
        </ul>
        <AutoLinkHeader size="h4">Button component</AutoLinkHeader>
        <ul>
          <li>Font-weight changes from semi-bold to normal</li>
        </ul>
        <AutoLinkHeader size="h4">Breadcrumb component</AutoLinkHeader>
        <ul>
          <li>Link and item font-weight changes from semi-bold to normal</li>
        </ul>
        <AutoLinkHeader size="h4">Alert component</AutoLinkHeader>
        <ul>
          <li>Title now defined as bold</li>
        </ul>
        <AutoLinkHeader size="h2">
          A note about existing overrides of PatternFly CSS in your application:
        </AutoLinkHeader>
        <p className="ws-mdx-p">
          With the CSS changes listed above, each change is defined in a{" "}
          <code>.pf-m-redhat-font</code> selector in the PatternFly CSS. That
          means that these variable overrides and new declarations are all in
          selectors that have a CSS specificity of 10 higher than they would
          normally.
        </p>
        <p className="ws-mdx-p">
          For example, the existing selector in PatternFly below has a
          specificity of 10:
        </p>
        <pre>
          <code>
            .pf-c-title &#123; --pf-c-title--m-lg--FontWeight:
            var(--pf-global--FontWeight--normal); &#125;
          </code>
        </pre>
        <p className="ws-mdx-p">
          When opting-in to the new font, that variable is now overridden as
          below, and the selector has a specificity of 20:
        </p>
        <pre>
          <code>
            .pf-m-redhat-font .pf-c-title &#123; --pf-c-title--m-lg--FontWeight:
            var(--pf-global--FontWeight--normal); &#125;
          </code>
        </pre>
        <p className="ws-mdx-p">
          So in your application, if you had overridden{" "}
          <code>--pf-c-title--m-lg--FontWeight</code> in your own CSS by
          defining your override after PatternFly’s CSS in the loading order and
          using a selector that has the same specificity as the original rule
          (10) from PatternFly, you will now need to increase the specificity of
          your override’s rule to match or exceed 20 for your override to still
          apply after opting-in to the new font.
        </p>
      </PageSection>
    </SideNavLayout>
  );
};