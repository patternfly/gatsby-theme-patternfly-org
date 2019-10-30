import React, { useEffect } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import ExampleToolbar from './exampleToolbar';
import AutoLinkHeader from './autoLinkHeader';
import { getParameters } from 'codesandbox/lib/api/define';
import 'prismjs/themes/prism-coy.css';
import { slugger } from '../helpers/slugger';
import './example.css';
import { transformCode } from '../helpers/transformCode';
import { getStaticParams, getReactParams } from '../helpers/codesandbox';
import Prism from 'prismjs';

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
  const { noLive, title = 'no title', isFullscreen = false, location, hideDarkMode, children, navSection, componentName } = props;

  // https://reactjs.org/docs/hooks-overview.html#state-hook
  const [editorCode, setEditorCode] = React.useState(initialLang === 'html' ? html : initialCode);
  const [editorLang, setEditorLang] = React.useState(initialLang);
  const [darkMode, setDarkMode] = React.useState(false);
  const [previewStyle, setPreviewStyle] = React.useState({});
  const [previewContainerStyle, setPreviewContainerStyle] = React.useState({ height: '437.5px' });

  const onLanguageChange = newLang => {
    setEditorLang(newLang);
    setEditorCode(newLang === 'html' ? html : initialCode);
  }

  if (editorLang === 'unknown') {
     // Inline code
    return <code className="ws-code">{children}</code>;
  } else if (noLive) {
    // Code block
    const html = Prism.highlight(children, Prism.languages.javascript, 'javascript');
    return <pre dangerouslySetInnerHTML={{ __html: html }} />;
  }
  const fullscreenLink = `${location.pathname}/${title.toLowerCase()}`;
  const scope = useMDXScope();
  const codeBoxParams = getParameters(
    props.html
    ? getStaticParams(props.title, html)
    : getReactParams(props.title, editorCode));
  
  const className = `ws-${props.source}-${navSection[0]}-${componentName}`;
  const id = `${className}-${slugger(title)}`;

  // https://reactjs.org/docs/hooks-effect.html
  if (isFullscreen) {
    useEffect(() => {
      const handleResize = () => {
        console.log('resize!');
        const resizeWidth = Math.min(
          document.getElementsByClassName('ws-example')[0].clientWidth,
          1280
        ) - 32.5;

        const scale = resizeWidth / 1280;
      
        setPreviewStyle({ transform: `scale(${scale})` });
        setPreviewContainerStyle({ height:`${scale * 800}px` });
      }

      if (!previewStyle.transform) {
        handleResize();
      }
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    });
  }

  const Preview = (
    <LivePreview
      id={id}
      style={previewStyle}
      className={`${className} ws-preview${
        darkMode ? ' pf-t-dark pf-m-opaque-200' : ''}${
        isFullscreen ? ' ws-preview-fullscreen' : ''}`} />
  );

  return (
    <div className="ws-example">
      <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
        {title.replace(/-/g, ' ').replace(/  /g, '-')}
      </AutoLinkHeader>
      <LiveProvider
        scope={scope}
        code={editorCode}
        transformCode={code => transformCode(code, editorLang, html)}
        disabled={isFullscreen || editorLang === 'hbs'}
        theme={{
          /* disable theme so we can use the global one imported in gatsby-browser.js */
          plain: {},
          styles: []
        }}
      >
        {/* We need this container for fullscreen example styling and popout */}
        {isFullscreen
          ? <a className="ws-preview-container"
              href={fullscreenLink}
              style={previewContainerStyle}>
              {Preview}
            </a>
          : Preview}
        
        <ExampleToolbar
          editor={<LiveEditor className="ws-editor"/>}
          supportedLangs={supportedLangs}
          onLanguageChange={onLanguageChange}
          onDarkmodeChange={() => setDarkMode(!darkMode)}
          hideDarkMode={hideDarkMode}
          isFullscreen={isFullscreen}
          fullscreenLink={fullscreenLink}
          code={editorCode}
          codeBoxParams={codeBoxParams} />
        <LiveError />
      </LiveProvider>
    </div>
  );
}

export default Example;
