import React from 'react';
import PropTypes from 'prop-types';
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
    lights: true
  };

  handleClickCopy = () => {
    // TODO: copy
    // copy(this.toCopy);
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
    const { editor, showLights, fullscreenLink, codeSandboxLink, supportedLangs } = this.props;
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
            onClick={this.handleClickCopy}
            variant="plain"
            title="Copy code"
            aria-label="Copy code"
          >
            <CopyIcon />
          </Button>
          {showLights && 
            <Button
              onClick={this.toggleLights}
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
