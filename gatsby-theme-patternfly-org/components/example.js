import React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import ExampleToolbar from './exampleToolbar';
import AutoLinkHeader from './autoLinkHeader';
import { getParameters } from 'codesandbox/lib/api/define';
import './example.css';

const transformCode = (code, language, html) => {
  if (typeof code !== 'string') {
    return;
  }
  if (language === 'hbs') {
    // HTML from handlebars
    return `<div dangerouslySetInnerHTML={{ __html: "${html
      .replace(/"/g, '\\"')
      .replace(/\n/g, '')}"}} />`;
  }
  else if (language === 'js') {
    return code
      .replace(/^\s*import.*from.*/gm, '') // single line import
      .replace(/^\s*import\s+{[\s\S]+?}\s+from.*/gm, '') // multi line import
      .replace(/^\s*export.*;/gm, '') // single line export
      .replace(/export default/gm, '') // inline export
  }
  // HTML
  return code.replace(/class=/g, 'className=');
}

const getLanguage = className => {
  if (typeof className !== 'string') {
    return 'pre';
  }
  else if (className.includes('-js')) {
    return 'jsx';
  }
  else if (className.includes('-hbs')) {
    return 'hbs';
  }

  return 'html';
}

const getSupportedLanguages = language => {
  switch (language) {
    case 'hbs':
      return ['html', 'hbs'];    
    case 'jsx':
      return ['jsx'];
    default:
      return [];
  }
}

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.lang = getLanguage(props.className);
    this.html = props.html
      ? props.html
      : 'This is a hbs code block, but no html trickled down from gatsby-node.js to mdx.js to example.js';
    const params = {
      files: {
        'index.html': {
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Include latest PatternFly css via CDN -->
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/@patternfly/patternfly/patternfly.css" 
      crossorigin="anonymous"
    >
    <title>PatternFly-next ${props.title} CodeSandbox Example</title>
  </head>
  <body>
    ${this.html}
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
    };
    this.codeBoxParams = getParameters(params);

    this.supportedLangs = getSupportedLanguages(this.lang);
    this.state = {
      code: props.children.toString(),
    };
  }

  onLanguageChange = newLang => {
    const initialCode = this.props.children.toString();
    if (newLang === 'html') {
      this.setState({ lang: newLang, code: this.html })
    }
    else {
      this.setState({ lang: newLang, code: initialCode });
    }
  }

  render() {
    const { code } = this.state;
    const { noLive, title, isFullscreen = false, location, children } = this.props;
    if (this.lang === 'pre') {
      return <pre>{children}</pre>;
    }
    if (isFullscreen && this.lang === 'jsx') {
      return (
        <LiveProvider
          code={code}
          transformCode={code => transformCode(code, this.lang, this.html)}>
          <LivePreview />
        </LiveProvider>
      );
    }
    return (
      <div className="ws-example">
        <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
          {title.replace(/-/g, ' ')}
        </AutoLinkHeader>
        <LiveProvider
          code={code}
          transformCode={code => transformCode(code, this.lang, this.html)}
          disabled={noLive || isFullscreen || this.lang === 'hbs'}
          theme={{
            /* disable theme so we can use the global one imported in gatsby-browser.js */
            plain: {},
            styles: []
          }}
        >
          {isFullscreen ? 'Fullscreen preview only' : <LivePreview className="ws-preview" />}
          <ExampleToolbar
            showLights={false}
            editor={<LiveEditor />}
            supportedLangs={this.supportedLangs}
            onLanguageChange={this.onLanguageChange}
            fullscreenLink={`${location.pathname}/${title.toLowerCase()}`}
            codeSandboxLink={`https://codesandbox.io/api/v1/sandboxes/define?parameters=${this.codeBoxParams}`} />
          {!noLive && <LiveError />}
        </LiveProvider>
      </div>
    );
  }
}