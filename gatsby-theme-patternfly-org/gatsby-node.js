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

const makeSlug = (source, section, componentName) => {
  let url = '';

  if (['react', 'core'].includes(source)) {
    url += `/documentation/${source}`;
  } else if (!source.includes('pages-')) {
    url += `/${source}`;
  }

  if (section !== 'root') {
    url += `/${slugger(section)}`
  }

  url += `/${slugger(componentName)}`;

  return url;
}

let addedToSchema = false;

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
      value: source.replace('pages-', '')
    });
    createNodeField({
      node,
      name: 'slug',
      value: makeSlug(source, section, componentName).toLowerCase()
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
    if (!addedToSchema) {
      // This is just to add to the schema so GraphQL queries don't fail
      createNodeField({ node, name: 'name', value: '' });
      createNodeField({ node, name: 'partial', value: '' });
      createNodeField({ node, name: 'source', value: '' });
      createNodeField({ node, name: 'slug', value: '' });
      createNodeField({ node, name: 'title', value: '' });

      addedToSchema = true;
    }
    if (node.extension === 'hbs') {
      const partial = fs.readFileSync(node.absolutePath, 'utf8');

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
    pages: allFile(filter: { fields: { slug: { nin: ["", null] } } }) {
      nodes {
        absolutePath
        fields {
          slug
          source
          title
        }
      }
    }
    partials: allFile(filter: { fields: { name: { nin: ["", null] } } }) {
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
      path: '/documentation/overview/global-css-variables',
      component: path.resolve(__dirname, `./pages/globalCSSVariables.js`),
      context: {
        navSection: 'overview',
        title: 'Global CSS variables',
        source: 'shared'
      }
    });

    const hbsInstance = createHandlebars(result.data.partials.nodes);
    const hidden = (pluginOptions.hiddenPages || []).map(title => title.toLowerCase());

    result.data.allMdx.nodes
      .concat(result.data.pages.nodes)
      .filter(node => !hidden.includes(node.fields.title.toLowerCase()))
      .forEach(node => {
        const { slug, navSection = null, title, source, propComponents = [] } = node.fields;
        const fileRelativePath = path.relative(__dirname, node.absolutePath || node.fileAbsolutePath);
        const tableOfContents = extractTableOfContents(node.mdxAST);
        const examples = extractExamples(node.mdxAST, hbsInstance, fileRelativePath);
        
        actions.createPage({
          path: slug,
          component: node.absolutePath || path.resolve(__dirname, `./templates/mdx.js`),
          context: {
            // Required by template to fetch more MDX/React docgen data
            id: node.id,
            propComponents,
            // For TOC
            tableOfContents,
            // For sideNav and Example.js (for className)
            navSection,
            // For TOC and Example.js
            title,
            source,
            // To render example HTML
            htmlExamples: source === 'core' ? examples : undefined,
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

// https://www.gatsbyjs.org/docs/schema-customization/
exports.createSchemaCustomization = ({ actions }) => {
  // Define types for sideNav if core, react, or org aren't included
  const sideNavTypeDefs = `
    type SideNavItem {
      section: String
      text: String
      path: String
    }
    type SideNav {
      core: [SideNavItem]
      react: [SideNavItem]
      get_started: [SideNavItem]
      design_guidelines: [SideNavItem]
      contribute: [SideNavItem]
    }
    type TopNavItem {
      text: String
      path: String
      context: String
    }
    type SitePluginOptions {
      sideNav: SideNav
      topNavItems: [TopNavItem]
    }
    type SitePlugin implements Node @infer {
      pluginOptions: SitePluginOptions
    }
  `;
  actions.createTypes(sideNavTypeDefs);
}

// Exclude CSS-in-JS styles
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [
            /react-styles\/css/
          ],
          loader: 'null-loader'
        }
      ]
    }
  });
};
