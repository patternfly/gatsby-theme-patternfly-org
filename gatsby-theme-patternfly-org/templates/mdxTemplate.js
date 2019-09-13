import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import SideNavLayout from '../layouts/sideNavLayout';

export default ({ data, location }) => (
  <SideNavLayout location={location}>
    <MDXRenderer>{data.mdx.body}</MDXRenderer>
  </SideNavLayout>
);

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      body
    }
  }
`;
