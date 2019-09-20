import React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import EditorToolbar from './editorToolbar';
import AutoLinkHeader from './autoLinkHeader';
import './example.css';

const transformCode = (code, language, hbs) => {
  if (typeof code !== 'string') {
    return;
  }
  if (language.includes('-hbs')) {
    return hbs.compile(code)({})
      .replace(/class=/g, 'className='); // HTML from handlebars
  }
  else if (language.includes('-js')) {
    return code
      .replace(/^\s*import.*from.*/gm, '') // single line import
      .replace(/^\s*import\s+{[\s\S]+?}\s+from.*/gm, '') // multi line import
      .replace(/^\s*export.*;/gm, '') // single line export
      .replace(/export default/gm, '') // inline export
  }
  // HTML
  return code.replace(/class=/g, 'className=');
}

export default props => {
  const { noLive, title, className, isFullscreen = false } = props;
  if (isFullscreen) {
    return (
      <LiveProvider
        code={props.children.toString()}
        transformCode={code => transformCode(code, className, props.handlebars)}
        >
        <LivePreview />
      </LiveProvider>
    );
  }
  return (
    <div className="ws-example">
      <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">
        {title}
      </AutoLinkHeader>
      <LiveProvider
        code={props.children.toString()}
        transformCode={code => transformCode(code, className, props.handlebars)}
        disabled={noLive}
        theme={{
          /* disable theme so we can use the global one imported in gatsby-browser.js */
          plain: {},
          styles: []
        }}
      >
        {!noLive && <LivePreview className="ws-preview" />}
        <EditorToolbar
          showLights={false}
          editor={<LiveEditor />} />
        {!noLive && <LiveError />}
      </LiveProvider>
    </div>
  )
}