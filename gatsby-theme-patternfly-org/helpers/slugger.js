const React = require('react');

// Should produce valid URLs and valid CSS ids
module.exports = {
  slugger: children => {
    const value = React.Children.toArray(children).join('');
    const whitespace = /\s/g;
    const specials = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
    return value
      .toLowerCase()
      .trim()
      .replace(specials, '')
      .replace(whitespace, '-');
  }
}