const path = require('path');
const fs = require('fs');
const { extractExamples } = require('./helpers/extractExamples');
const { extractTableOfContents } = require('./helpers/extractTableOfContents');
const { createHandlebars } = require('./helpers/createHandlebars');

// Add map PR-related environment variables to gatsby nodes
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const num = process.env.CIRCLE_PR_NUMBER || process.env.PR_NUMBER;
  const url = process.env.CIRCLE_PULL_REQUEST;
  const lastTag = 'latest';
  // Docs https://www.gatsbyjs.org/docs/actions/#createNode
  actions.createNode({
    name: 'PR_INFO',
    num: num || '',
    url: url || '',
    lastTag: lastTag || '',
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

    let { section = 'root', title } = node.frontmatter;
    createNodeField({
      node,
      name: 'source',
      value: source
    });
    createNodeField({
      node,
      name: 'slug',
      value: `/documentation/${source}${
      section === 'root'
        ? ''
        : `/${section}`
      }/${path.basename(node.fileAbsolutePath, '.md')}`.toLowerCase()
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
  } else if (node.internal.type === 'File') {
    if (node.extension === 'hbs' && !node.relativePath.includes('example')) {
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
    } else {
      // Add a null field so React's docs don't crash on the GraphQL for
      // patternfly-next like allFile(filter: { fields: { name: { ne: "" } } })
      createNodeField({
        node,
        name: 'name',
        value: ''
      });
      createNodeField({
        node,
        name: 'partial',
        value: ''
      });
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
    partials: allFile(filter: { fields: { name: { ne: "" } } }) {
      nodes {
        fields {
          name
          partial
        }
      }
    }
    sitePlugin(name: { eq: "gatsby-theme-patternfly-org" }) {
      pluginOptions {
        hiddenPages
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    // Create a global CSS Variable page
    actions.createPage({
      path: '/documentation/global-css-variables',
      component: path.resolve(__dirname, `./pages/globalCSSVariables.js`),
    });

    const hbsInstance = createHandlebars(result.data.partials.nodes);

    const hidden = (result.data.sitePlugin.pluginOptions.hiddenPages || []).map(title => title.toLowerCase());

    result.data.allMdx.nodes.filter(node => hidden.indexOf(node.fields.title.toLowerCase()) === -1).forEach(node => {
      const tableOfContents = extractTableOfContents(node.mdxAST) || [];
      const { slug, navSection, title, source } = node.fields;

      const examples = extractExamples(node.mdxAST, hbsInstance);
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
          htmlExamples: source === 'core' ? examples : undefined,
          // To render TOC
          tableOfContents,
        }
      });

      // Create per-example fullscreen pages
      Object.entries(examples).forEach(([key, example]) => {
        if (source === 'html') {
          actions.createPage({
            path: `${slug}/${key}`,
            component: path.resolve(__dirname, `./templates/fullscreenHtml.js`),
            context: {
              html: example
            }
          })
        }
        else if (source === 'react') {
          actions.createPage({
            path: `${slug}/${key}`,
            component: path.resolve(__dirname, `./templates/fullscreenMdx.js`),
            context: {
              jsx: example
            }
          })
        }
      });
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
