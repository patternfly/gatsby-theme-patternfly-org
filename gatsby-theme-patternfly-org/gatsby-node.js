const path = require('path');

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

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    createNodeField({
      node,
      name: 'slug',
      value: `/documentation/core/${node.frontmatter.section}/${path.basename(node.fileAbsolutePath, '.md')}`.toLowerCase()
    });
    createNodeField({
      node,
      name: 'navSection',
      value: node.frontmatter.section.toLowerCase()
    });
    createNodeField({
      node,
      name: 'title',
      value: node.frontmatter.title
    });
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMdx {
        nodes {
          id
          fields {
            slug
            navSection
            title
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    return result.data.allMdx.nodes.forEach(node => {
      const { slug, navSection, title } = node.fields;

      createPage({
        path: node.fields.slug,
        component: path.resolve(__dirname, `./templates/mdxTemplate.js`),
        context: {
          id: node.id,
          slug,
          navSection,
          title
        }
      });
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) =>
  new Promise((resolve, reject) => {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /\.hbs$/,
            query: {
              extensions: '.hbs',
            },
            loader: 'handlebars-loader'
          }
        ]
      },
    });
    resolve();
  });
