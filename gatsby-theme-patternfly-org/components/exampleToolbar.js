import React from 'react';
import { Button, TextContent, Text } from '@patternfly/react-core';
import { CopyIcon, AsleepIcon, ExternalLinkAltIcon, CodepenIcon } from '@patternfly/react-icons';

export default class ExampleToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.toCopy = props.code;
  }

  state = {
    codeOpen: false,
    openLang: null,
    showCopyMessage: false,
  };

  onCopy = () => {
    let el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = this.props.code;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {
      display: 'none',
      position: 'absolute',
      left: '-9999px'
    };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

    this.setState({
      showCopyMessage: true
    });
    setTimeout(() => {
      this.setState({
        showCopyMessage: false
      });
    }, 2000);
  };

  onLanguageChange = lang => {
    this.setState({
      codeOpen: this.state.codeOpen && this.state.openLang === lang ? false : true,
      openLang: lang
    });

    if (this.props.onLanguageChange) {
      this.props.onLanguageChange(lang);
    }
  }

  render() {
    const { editor, fullscreenLink, codeSandboxLink, supportedLangs, onDarkmodeChange, isFullscreen } = this.props;
    const { codeOpen, showCopyMessage } = this.state;

    return (
      <React.Fragment>
        <div>
          {supportedLangs.map(lang => 
            <Button
              key={lang}
              onClick={() => this.onLanguageChange(lang)}
              variant="plain"
              title={`Toggle ${lang} code`}
              aria-label={`Toggle ${lang} code`}
            >
              {lang.toUpperCase()}
            </Button>
          )}
          <Button
            onClick={this.onCopy}
            variant="plain"
            title="Copy code"
            aria-label="Copy code"
          >
            <CopyIcon />
          </Button>
          {!isFullscreen &&
            <Button
              onClick={onDarkmodeChange}
              variant="plain"
              title="Toggle Dark Theme"
              aria-label="Toggle Dark Theme"
            >
              <AsleepIcon />
            </Button>
          }
          {/* TODO: Make this a POST request in a form so we can send more than 2k characters */}
          {/* https://codesandbox.io/docs/importing#define-api */}
          {codeSandboxLink &&
            <Button
              component="a"
              href={codeSandboxLink} 
              target="_blank"
              rel="noopener noreferrer"
              variant="plain"
              title="Open in CodeSandbox"
              aria-label="Open in CodeSandbox"
            >
              <CodepenIcon />
            </Button>
          }
          {fullscreenLink &&
            <Button
              component="a"
              href={fullscreenLink} 
              target="_blank"
              rel="noopener noreferrer"
              variant="plain"
              title="Open in new window"
              aria-label="Open in new window"
            >
              <ExternalLinkAltIcon />
            </Button>
          }
          {showCopyMessage &&
            <TextContent>
              <Text component="pre" className="messageText">
                Copied to clipboard
              </Text>
            </TextContent>
          }
        </div>
        {codeOpen && editor}
      </React.Fragment>
    );
  }
}
