import React from 'react';
import { Link } from 'gatsby';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import ExampleToolbar from './exampleToolbar';
import AutoLinkHeader from './autoLinkHeader';
import { getParameters } from 'codesandbox/lib/api/define';
import 'prismjs/themes/prism-coy.css';
import { slugger } from '../helpers/slugger';
import './example.css';
import { transformCode } from '../helpers/transformCode';
import { removeTrailingSlash } from '../helpers/removeTrailingSlash';

const getSupportedLanguages = className => {
  if (typeof className === 'string') {
    if (className.includes('-js')) {
      return ['jsx'];
    }
    else if (className.includes('-hbs')) {
      return ['html', 'hbs'];
    }
  }
  return ['unknown'];
}

const getStaticParams = (title, html) => ({
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

const getReactParams = (title, jsx) => ({
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
${jsx}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);`
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
  template: 'create-react-app',
});

// This component uses hooks in order to call useMDXScope()
export default props => {
  const html = props.html
    ? props.html
    : 'This is a hbs code block, but no html trickled down from gatsby-node.js to mdx.js to example.js';
  const supportedLangs = getSupportedLanguages(props.className);
  const initialLang = supportedLangs[0];
  const initialCode = props.children.toString();
  const { noLive, title = 'no title', isFullscreen = false, location, children } = props;

  // https://reactjs.org/docs/hooks-overview.html#state-hook
  const [editorCode, setEditorCode] = React.useState(initialLang === 'html' ? html : initialCode);
  const [editorLang, setEditorLang] = React.useState(initialLang);
  const [darkMode, setDarkMode] = React.useState(false);

  const onLanguageChange = newLang => {
    setEditorLang(newLang);
    setEditorCode(newLang === 'html' ? html : initialCode);
  }

  if (editorLang === 'unknown') {
    return <code className="ws-code">{children}</code>;
  }
  const fullscreenLink = `${location.pathname}/${title.toLowerCase()}`;
  // /documentation/core/{components,layouts,utilities,experimental}
  const split = removeTrailingSlash(location.pathname).split('/');
  const section = split[3];
  const component = split.pop();
  const codeBoxParams = getParameters(props.html
    ? getStaticParams(props.title, html)
    : getReactParams(props.title, editorCode, editorLang));
  return (
    <div className="ws-example">
      <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
        {title.replace(/-/g, ' ')}
      </AutoLinkHeader>
      <LiveProvider
        scope={useMDXScope()}
        code={editorCode}
        transformCode={code => transformCode(code, editorLang, html)}
        disabled={noLive || isFullscreen || editorLang === 'hbs'}
        theme={{
          /* disable theme so we can use the global one imported in gatsby-browser.js */
          plain: {},
          styles: []
        }}
      >
        {isFullscreen
          ? <div className="ws-preview">This preview can be accessed in <Link to={fullscreenLink}>full page mode.</Link></div>
          : <LivePreview
            id={`ws-${props.source}-${section[0]}-${component}-${slugger(title)}`}
            className={`ws-${props.source}-${section[0]}-${component} ws-preview${darkMode ? ' pf-t-dark pf-m-opaque-200' : ''}`} />}
        <ExampleToolbar
          editor={<LiveEditor className="ws-editor"/>}
          supportedLangs={supportedLangs}
          onLanguageChange={onLanguageChange}
          onDarkmodeChange={() => setDarkMode(!darkMode)}
          isFullscreen={isFullscreen}
          fullscreenLink={fullscreenLink}
          code={editorCode}
          codeSandboxLink={`https://codesandbox.io/api/v1/sandboxes/define?parameters=${codeBoxParams}`} />
        {!noLive && <LiveError />}
      </LiveProvider>
    </div>
  );
}
