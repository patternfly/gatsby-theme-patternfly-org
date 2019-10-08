module.exports = {
  removeTrailingSlash: link => {
    if (link.endsWith('/')) {
      return link.substr(0, link.length - 1);
    }
  
    return link;
  }
}