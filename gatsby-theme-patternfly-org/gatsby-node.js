const path = require('path');
const fs = require('fs');
const partials = {};
const { extractExamples } = require('./helpers/extractExamples');

// Add map PR-related environment variables to gatsby nodes
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const num = process.env.CIRCLE_PR_NUMBER || process.env.PR_NUMBER;
  const url = process.env.CIRCLE_PULL_REQUEST;
  // Docs https://www.gatsbyjs.org/docs/actions/#createNode
  actions.createNode({
    name: 'PR_INFO',
    num: num || '',
    url: url || '',
    id: createNodeId('PR_INFO'),
    parent: null,
    children: [],
    internal: {
      contentDigest: createContentDigest({ a: 'PR_INFO' }),
      type: 'EnvVars'
    }
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    // Source comes from gatsby-source-filesystem definition in gatsby-config.js
    const source = getNode(node.parent).sourceInstanceName;
    const { section, title } = node.frontmatter;
    createNodeField({
      node,
      name: 'source',
      value: source
    });
    createNodeField({
      node,
      name: 'slug',
      value: `/documentation/${source}/${section}/${path.basename(node.fileAbsolutePath, '.md')}`.toLowerCase()
    });
    createNodeField({
      node,
      name: 'navSection',
      value: section.toLowerCase()
    });
    createNodeField({
      node,
      name: 'title',
      value: title
    });
  } else if (node.internal.type === 'File' && node.extension === 'hbs') {
    // Add a special field to identify partial files
    const split = node.absolutePath.split('/');
    const parentFolder = split[split.length - 2];
    // Exclude example partials, they just bloat bundle
    if (!parentFolder.includes('example')) {
      const partial = fs.readFileSync(node.absolutePath, 'utf8');
      // Exclude empty partials, they bug out 
      if (partial) {
        createNodeField({
          node,
          name: 'name',
          value: path.basename(node.absolutePath, '.hbs')
        });
        createNodeField({
          node,
          name: 'partial',
          value: partial
        });
      }
    }
  }
};

exports.createPages = ({ actions, graphql, getNode }) => graphql(`
  {
    allMdx {
      nodes {
        id
        fields {
          slug
          source
          navSection
          title
        }
        mdxAST
      }
    }
  }
  `).then(result => result.data.allMdx.nodes.forEach(node => {
    const { slug, source, navSection, title } = node.fields;

    actions.createPage({
      path: slug,
      component: path.resolve(__dirname, `./templates/mdxTemplate.js`),
      context: {
        id: node.id,
        source,
        slug,
        navSection,
        title,
      }
    });

    // Crawl the AST to find examples and create new pages for them
    // Object.entries(extractExamples(node.mdxAST)).forEach(([key, mdxBody]) => {
    //   actions.createPage({
    //     path: `${slug}/${key}`,
    //     component: path.resolve(__dirname, `./templates/mdxTemplateFullscreen.js`),
    //     context: {
    //       mdxBody
    //     }
    //   })
    // })
  }));

exports.onCreateWebpackConfig = ({ actions }) => actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: 'null-loader'
        }
      ]
    }
  });
