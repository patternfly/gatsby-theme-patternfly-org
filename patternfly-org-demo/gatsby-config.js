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
      options: {
        topNavItems: [
          {
            text: 'Get started',
            link: '/get-started/about'
          },
          {
            text: 'Design guidelines',
            link: '/design-guidelines/styles/colors'
          },
          {
            text: 'Documentation',
            link: '/documentation/core/components/aboutmodalbox'
          },
          {
            text: 'Contribute',
            link: '/contribute/about'
          },
          {
            text: 'Get in touch',
            link: '/get-in-touch'
          },
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'core', // This goes in URLs
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
