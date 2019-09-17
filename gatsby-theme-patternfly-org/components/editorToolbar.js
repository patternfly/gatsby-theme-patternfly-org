import React from 'react';
import { css } from '@patternfly/react-styles';
import PropTypes from 'prop-types';
import { Button, TextContent, Text } from '@patternfly/react-core';
import { CodeIcon, CopyIcon, AsleepIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const propTypes = {
  className: PropTypes.string,
  editor: PropTypes.element.isRequired,
  live: PropTypes.bool,
  fullscreenLink: PropTypes.string,
};

const defaultProps = {
  className: '',
  live: true,
  fullscreenLink: ''
};

class EditorToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.toCopy = props.code;
  }

  state = {
    codeOpen: false,
    showCopyMessage: false,
    lights: true
  };

  onToggle = () => {
    this.setState({
      codeOpen: !this.state.codeOpen
    });
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

  render() {
    const { editor, live, showLights, fullscreenLink } = this.props;
    const { codeOpen, showCopyMessage } = this.state;

    return (
      <React.Fragment>
        <div className="toolbar">
          <Button
            onClick={this.onToggle}
            variant="plain"
            title="Toggle code"
            aria-label="Toggle code"
          >
            <CodeIcon />
          </Button>
          <Button
            onClick={this.handleClickCopy}
            variant="plain"
            title="Copy code"
            aria-label="Copy code"
          >
            <CopyIcon />
          </Button>
          {showLights && <Button
            onClick={this.toggleLights}
            variant="plain"
            title="Toggle Dark Theme"
            aria-label="Toggle Dark Theme"
          >
            <AsleepIcon />
          </Button>}
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
          {showCopyMessage && (
            <TextContent>
              <Text component="pre" className={css('messageText')}>
                Copied to clipboard
              </Text>
            </TextContent>
          )}
          {codeOpen && !live && (
            <TextContent className="messageShow">
              <Text component="pre" className="messageText">
                Live editing disabled
              </Text>
            </TextContent>
          )}
        </div>
        {codeOpen && editor}
      </React.Fragment>
    );
  }
}

EditorToolbar.propTypes = propTypes;
EditorToolbar.defaultProps = defaultProps;

export default EditorToolbar;
