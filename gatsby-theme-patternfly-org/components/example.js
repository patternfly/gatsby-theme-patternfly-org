import React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import EditorToolbar from './editorToolbar';
import AutoLinkHeader from './autoLinkHeader';
import './example.css';

const transformCode = (code, language, html) => {
  if (typeof code !== 'string') {
    return;
  }
  if (language === 'hbs') {
    // HTML from handlebars
    return `<div dangerouslySetInnerHTML={{ __html: "${html}"}} />`;
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
  if (className.includes('-js')) {
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
      ? props.html.replace(/"/g, '\\"').replace(/\n/g, '')
      : 'This is a hbs code block, but no html trickled down from gatsby-node.js to mdx.js to example.js';

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
          <EditorToolbar
            showLights={false}
            editor={<LiveEditor />}
            supportedLangs={this.supportedLangs}
            onLanguageChange={this.onLanguageChange}
            fullscreenLink={`${location.pathname}/${title.toLowerCase()}`} />
          {!noLive && <LiveError />}
        </LiveProvider>
      </div>
    );
  }
}