import React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import EditorToolbar from './editorToolbar';
import AutoLinkHeader from './autoLinkHeader';
import './example.css';

export default class Example extends React.Component {
  static transformCode(code) {
    if (typeof code !== 'string') {
      return;
    }
    // These don't actually do anything except make Buble mad
    const toParse = code
      .replace(/^\s*import.*from.*/gm, '') // single line import
      .replace(/^\s*import\s+{[\s\S]+?}\s+from.*/gm, '') // multi line import
      .replace(/^\s*export.*;/gm, '') // single line export
      .replace(/export default/gm, '') // inline export

    return toParse;
  }

  render() {
    const { noLive, title } = this.props;
    return (
      <div className="ws-example">
        <AutoLinkHeader size="h4" headingLevel="h3" className="ws-example-heading">{title}</AutoLinkHeader>
        <LiveProvider
          code={this.props.html || this.props.react}
          scope={this.scope}
          transformCode={Example.transformCode}
          disabled={noLive}
          theme={{
            /* disable theme so we can use the global one imported in gatsby-browser.js */
            plain: {},
            styles: []
          }}
        >
          {!noLive && <LivePreview className="ws-preview" />}
          <EditorToolbar
            raw={this.code}
            showLights={false}
            editor={<LiveEditor />}
            onLightsChange={this.onDarkModeChange} />
          {!noLive && <LiveError />}
        </LiveProvider>
      </div>
    )
  }
}