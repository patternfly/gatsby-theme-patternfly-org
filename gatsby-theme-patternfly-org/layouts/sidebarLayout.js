import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import { SideNavLayout } from './sideNav';

export default ({ data }) => {
  return (
    <SideNavLayout>
      <MDXRenderer>
        {data.mdx.body}
      </MDXRenderer>
    </SideNavLayout>
  );
};

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      body
    }
  }
`;
