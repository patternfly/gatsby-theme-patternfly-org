module.exports = {
  plugins: [
    // Pipe MDX files through this plugin that spits out React components
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          default: require.resolve('./templates/mdxDefault.js'),
        },
      }
    },
    // Convienently change <head> based on JS
    'gatsby-plugin-react-helmet',
    // Get version numbers from package.json files
    'gatsby-transformer-json',
  ]
}
