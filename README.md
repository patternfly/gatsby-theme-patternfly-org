# gatsby-theme-patternfly-org

This theme consolidates [Gatsby](https://www.gatsbyjs.org/) documentation configuration across [patternfly-next](https://github.com/patternfly/patternfly-next/), [patternfly-react](https://github.com/patternfly/patternfly-react/), and [patternfly.org.](https://github.com/patternfly/gatsby-theme-patternfly-org/tree/master/patternfly-org-demo)

## Getting started

Our repo uses submodules, so make sure to pull those down:

`git clone --recurse-submodules -j8 https://github.com/patternfly/gatsby-theme-patternfly-org`

Make sure to install all the repo's dependencies. It takes a while.

`yarn install`

Build React.

`yarn build:react`

Now you can develop Core, React, and Org:

`yarn develop:next`

`yarn develop:react`

`yarn develop:org`

## patternfly-org-demo
```sh
patternfly-org-demo
├── gatsby-browser.js
├── gatsby-config.js
├── gatsby-node.js
├── gatsby-ssr.js
├── package.json
├── patternfly-next
│   └── package.json
├── patternfly-react
│   └── package.json
├── public
├── src
│   ├── content
│   ├── images
│   └── pages
└── static
    └── assets
```

`patternfly-org-demo` is what houses the [Gatsby](https://www.gatsbyjs.org/) patternfly.org project. `patternfly-next` contains the submodule used for developing [pf4.patternfly.org](https://pf4.patternfly.org/). `patternfly-react` contains the submodule used for developing [patternfly-react.surge.sh.](https://patternfly-react.surge.sh/patternfly-4/)
