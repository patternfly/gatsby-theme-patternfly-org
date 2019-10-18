const path = require('path');
const fs = require('fs');
const { extractExamples } = require('./helpers/extractExamples');
const { extractTableOfContents } = require('./helpers/extractTableOfContents');
const { createHandlebars } = require('./helpers/createHandlebars');
const { slugger } = require('./helpers/slugger');

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
    const componentName = path.basename(node.fileAbsolutePath, '.md');

    let { section = 'root', title, propComponents = [''] } = node.frontmatter;
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
        : `/${slugger(section)}`
      }/${slugger(componentName)}`.toLowerCase()
    });
    createNodeField({
      node,
      name: 'navSection',
      value: section.toLowerCase()
    });
    createNodeField({
      node,
      name: 'componentName',
      value: componentName.toLowerCase()
    });
    createNodeField({
      node,
      name: 'title',
      value: title
    });
    // We need to populate this for the query on `fields` in createPages
    createNodeField({
      node,
      name: 'propComponents',
      value: propComponents
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

exports.createPages = ({ actions, graphql }, pluginOptions) => graphql(`
  {
    allMdx {
      nodes {
        id
        fileAbsolutePath
        mdxAST
        fields {
          slug
          source
          navSection
          title
          propComponents
        }
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
    const hidden = (pluginOptions.hiddenPages || []).map(title => title.toLowerCase());

    result.data.allMdx.nodes
      .filter(node => !hidden.includes(node.fields.title.toLowerCase()))
      .forEach(node => {
        const tableOfContents = extractTableOfContents(node.mdxAST) || [];
        const { slug, navSection, title, source, propComponents = [] } = node.fields;

        const examples = extractExamples(node.mdxAST, hbsInstance, path.relative(__dirname, node.fileAbsolutePath));
        actions.createPage({
          path: slug,
          component: path.resolve(__dirname, `./templates/mdx.js`),
          context: {
            // Required by template to fetch more MDX/React docgen data
            id: node.id,
            propComponents,
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
          if (source === 'core') {
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
