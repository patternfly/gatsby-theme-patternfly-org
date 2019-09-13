const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'PatternFly 4',
    description: 'Documentation for PatternFly 4',
    siteUrl: 'https://www.patternfly.org'
  },
  plugins: [
    {
      resolve: `gatsby-theme-patternfly-org`,
      options: {}
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${path.resolve(__dirname)}/patternfly-next/src/patternfly`
      }
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     path: `${path.resolve(__dirname)}/patternfly-react`
    //   }
    // },
  ],
}
