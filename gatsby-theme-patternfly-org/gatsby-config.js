module.exports = {
  plugins: [
    // Pipe MDX files through this plugin that spits out React components
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.mdx`, `.md`],
      }
    },
    // Convienently change root portions of doc
    'gatsby-plugin-react-helmet',
  ]
}
