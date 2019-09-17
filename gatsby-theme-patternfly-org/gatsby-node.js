const path = require('path');

const partials = {};

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
    createNodeField({
      node,
      name: 'source',
      value: source
    });
    createNodeField({
      node,
      name: 'slug',
      value: `/documentation/${source}/${node.frontmatter.section}/${path.basename(node.fileAbsolutePath, '.md')}`.toLowerCase()
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
  } else if (node.internal.type === 'File' && node.extension === 'hbs'){
    partials[path.basename(node.absolutePath, '.hbs')] = node.absolutePath;
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
      }
    }
  }
`).then(result => {
  if (result.errors) {
    return Promise.reject(result.errors);
  }

  return result.data.allMdx.nodes.forEach(node => {
    const { slug, source, navSection, title } = node.fields;

    actions.createPage({
      path: node.fields.slug,
      component: path.resolve(__dirname, `./templates/mdxTemplate.js`),
      context: {
        id: node.id,
        source,
        slug,
        navSection,
        title,
      }
    });
  });
});

exports.onCreateWebpackConfig = ({ stage, actions }) =>{
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.hbs$/,
          query: {
            extensions: '.hbs',
            partialResolver(partial, callback) {
              if (partials[partial]) {
                callback(null, partials[partial]);
              } else {
                callback(new Error(`Could not find partial: ${partial}`), '');
              }
            },
          },
          loader: 'handlebars-loader'
        }
      ]
    },
  });
}
