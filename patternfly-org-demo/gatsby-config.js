const path = require('path');

module.exports = {
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
