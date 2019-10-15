// TODO: Use a template that has our assets.
export const getStaticParams = (title, html) => ({
  files: {
    'index.html': {
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Include latest PatternFly CSS via CDN -->
  <link 
    rel="stylesheet" 
    href="https://unpkg.com/@patternfly/patternfly/patternfly.css" 
    crossorigin="anonymous"
  >
  <title>PatternFly-Next ${title} CodeSandbox Example</title>
</head>
<body>
  ${html}
</body>
</html>`,
    },
    'package.json': {
      content: {},
    },
    'sandbox.config.json': {
      content: { template: 'static' }
    }
  },
  template: 'static',
});

// TODO: Make React examples work and use a template that has our assets.
export const getReactParams = (title, code) => {
  let toRender = 'Example';
  const classNameMatch = /class (\w+) /.exec(code);
  const equalityMatch = /(\w+) =/.exec(code);
  if (classNameMatch) {
    toRender = classNameMatch[1];
  } else if (equalityMatch) {
    toRender = equalityMatch[1];
    code = code.replace(/(\w+) =/, `const ${toRender} =`)
  }
  return {
    files: {
      'index.html': {
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Include latest PatternFly CSS via CDN -->
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/@patternfly/patternfly/patternfly-base.css" 
      crossorigin="anonymous"
    >
    <title>PatternFly-React ${title} CodeSandbox Example</title>
  </head>
<body>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <div id="root"></div>
</body>
</html>`,
      },
      'index.js': {
        content: `import ReactDOM from "react-dom";
${code}

const rootElement = document.getElementById("root");
ReactDOM.render(<${toRender} />, rootElement);`
      },
      'package.json': {
        content: {
          dependencies: {
            '@patternfly/react-core': 'latest',
            'react': '16.9.0',
            'react-dom': '16.9.0'
          }
        },
      },
      'sandbox.config.json': {
        content: { template: 'create-react-app' }
      }
    },
  }
}
