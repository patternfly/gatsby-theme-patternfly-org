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
import { getStaticParams, getReactParams } from '../helpers/codesandbox';

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

// This component uses hooks in order to call useMDXScope()
const Example = props => {
  const html = props.html
    ? props.html
    : 'This is a hbs code block, but no html trickled down from gatsby-node.js to mdx.js to example.js';
  const supportedLangs = getSupportedLanguages(props.className);
  const initialLang = supportedLangs[0];
  const initialCode = props.children.toString();
  const { noLive, title = 'no title', isFullscreen = false, location, hideDarkMode, children } = props;

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
  const scope = useMDXScope();
  // /documentation/core/{components,layouts,utilities,experimental}
  const split = removeTrailingSlash(location.pathname).split('/');
  const section = split[3];
  const component = split.pop();
  const codeBoxParams = getParameters(
    props.html
    ? getStaticParams(props.title, html)
    : getReactParams(props.title, editorCode));
  
  return (
    <div className="ws-example">
      <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
        {title.replace(/-/g, ' ').replace(/  /g, '-')}
      </AutoLinkHeader>
      <LiveProvider
        scope={scope}
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
          ? <div className="ws-preview">This preview can be accessed in <a href={fullscreenLink} target="_blank">full page mode.</a></div>
          : <LivePreview
            id={`ws-${props.source}-${section[0]}-${component}-${slugger(title)}`}
            className={`ws-${props.source}-${section[0]}-${component} ws-preview${darkMode ? ' pf-t-dark pf-m-opaque-200' : ''}`} />}
        <ExampleToolbar
          editor={<LiveEditor className="ws-editor"/>}
          supportedLangs={supportedLangs}
          onLanguageChange={onLanguageChange}
          onDarkmodeChange={() => setDarkMode(!darkMode)}
          hideDarkMode={hideDarkMode}
          isFullscreen={isFullscreen}
          fullscreenLink={fullscreenLink}
          code={editorCode}
          codeSandboxLink={`https://codesandbox.io/api/v1/sandboxes/define?parameters=${codeBoxParams}`} />
        {!noLive && <LiveError />}
      </LiveProvider>
    </div>
  );
}

export default Example;
