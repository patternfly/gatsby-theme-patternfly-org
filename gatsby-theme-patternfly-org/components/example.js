import React from 'react';
import { Link } from 'gatsby';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import ExampleToolbar from './exampleToolbar';
import AutoLinkHeader from './autoLinkHeader';
import { getParameters } from 'codesandbox/lib/api/define';
import 'prismjs/themes/prism-coy.css';
import { slugger } from '../helpers/slugger';
import './example.css';

const transformCode = (code, language, html) => {
  if (typeof code !== 'string') {
    return;
  }
  if (language === 'js') {
    return code
      .replace(/^\s*import.*from.*/gm, '') // single line import
      .replace(/^\s*import\s+{[\s\S]+?}\s+from.*/gm, '') // multi line import
      .replace(/^\s*export.*;/gm, '') // single line export
      .replace(/export default/gm, '') // inline export
  }
  // HTML/HBS
  const transformed = language === 'hbs' ? html : code;
  return `<div className="ws-preview-html" dangerouslySetInnerHTML={{ __html: "${transformed
    .replace(/"/g, '\\"')
    .replace(/\n/g, '')}"}} />`;;
}

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

const getParams = (title, html) => ({
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
  <title>PatternFly-next ${title} CodeSandbox Example</title>
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

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.html = props.html
      ? props.html
      : 'This is a hbs code block, but no html trickled down from gatsby-node.js to mdx.js to example.js';
    this.codeBoxParams = props.html ? getParameters(getParams(props.title, this.html)) : '';

    this.supportedLangs = getSupportedLanguages(props.className);
    const initialLang = this.supportedLangs[0];

    this.state = {
      editorCode: initialLang === 'html' ? this.html : props.children.toString(),
      editorLang: initialLang,
      darkMode: false
    };
  }

  onLanguageChange = newLang => {
    if (newLang === 'html') {
      this.setState({ editorLang: newLang, editorCode: this.html })
    }
    else {
      const initialCode = this.props.children.toString();
      this.setState({ editorLang: newLang, editorCode: initialCode });
    }
  }

  onDarkmodeChange = () => {
    this.setState({ darkMode: !this.state.darkMode });
  }

  render() {
    const { editorCode, darkMode, editorLang } = this.state;
    const { noLive, title, isFullscreen = false, location, children } = this.props;

    if (editorLang === 'unknown') {
      return <code className="ws-code">{children}</code>;
    }
    if (isFullscreen && editorLang === 'jsx') {
      return (
        <LiveProvider
          code={editorCode}
          transformCode={code => transformCode(code, editorLang, this.html)}>
          <LivePreview />
        </LiveProvider>
      );
    }
    const fullscreenLink = `${location.pathname}/${title.toLowerCase()}`;
    // /documentation/core/{components,layouts,utilities,experimental}
    const split = location.pathname.split('/');
    const section = split[3];
    const component = split.pop();
    return (
      <div className="ws-example">
        <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
          {title.replace(/-/g, ' ')}
        </AutoLinkHeader>
        <LiveProvider
          code={editorCode}
          transformCode={code => transformCode(code, editorLang, this.html)}
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
              id={`ws-example-${section[0]}-${component}-${slugger(title)}`}
              className={`ws-example-${section[0]}-${component} ws-preview ${darkMode ? 'pf-t-dark pf-m-opaque-200' : ''}`} />}
          <ExampleToolbar
            editor={<LiveEditor className="ws-editor"/>}
            supportedLangs={this.supportedLangs}
            onLanguageChange={this.onLanguageChange}
            onDarkmodeChange={this.onDarkmodeChange}
            isFullscreen={isFullscreen}
            fullscreenLink={fullscreenLink}
            code={editorCode}
            codeSandboxLink={`https://codesandbox.io/api/v1/sandboxes/define?parameters=${this.codeBoxParams}`} />
          {!noLive && <LiveError />}
        </LiveProvider>
      </div>
    );
  }
}
