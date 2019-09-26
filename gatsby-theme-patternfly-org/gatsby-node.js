const path = require('path');
const fs = require('fs');
const { extractCoreExamples } = require('./helpers/extractExamples');
const { createHandlebars } = require('./helpers/createHandlebars');

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
    const parent = getNode(node.parent);
    const source = parent.sourceInstanceName;

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
    // Exclude example partials, they just bloat bundle
    if (!node.relativePath.includes('example')) {
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

exports.createPages = ({ actions, graphql }) => graphql(`
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
    partials: allFile(filter: { fields: { name: { ne: null } } }) {
      nodes {
        fields {
          name
          partial
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    const hbsInstance = createHandlebars(result.data.partials.nodes);

    result.data.allMdx.nodes.forEach(node => {
      const htmlExamples = extractCoreExamples(node.mdxAST, hbsInstance);
      const { slug, navSection, title } = node.fields;

      actions.createPage({
        path: slug,
        component: path.resolve(__dirname, `./templates/mdx.js`),
        context: {
          // To fetch more MDX data
          id: node.id,
          // For use in sideNav.js
          navSection,
          title,
          // To render example HTML
          htmlExamples,
        }
      });

      // Create per-example fullscreen pages
      Object.entries(htmlExamples).forEach(([key, html]) =>
        actions.createPage({
          path: `${slug}/${key}`,
          component: path.resolve(__dirname, `./templates/htmlFullscreen.js`),
          context: {
            html
          }
        })
      );
    });
  });

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
