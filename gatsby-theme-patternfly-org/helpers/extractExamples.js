const visit = require('unist-util-visit');
var { render } = require('html-formatter');
const { getId } = require('./getId');

module.exports = {
  // Map example page urls to HTML
  extractExamples: (mdxAST, hbsInstance, fileName) => {
    const examples = {};

    visit(mdxAST, 'code', node => {
      const id = node.meta ? getId(node.meta.match(/title=(\S*)/)[1]) : 'no-id';
      if (node.lang === 'hbs') {
        try {
          const html = hbsInstance.compile(node.value)({});
          // Add rendered HTML to make fullscreen page from
          examples[id] = render(html).replace(/\t/g, '  ');
        }
        catch(error) {
          console.error(`\x1b[31m${fileName}: ${error} for PatternFly example ${id}\x1b[0m`)
        }
      }
      else if (node.lang === 'js') {
        node.lang = 'jsx';
        // Add rendered MDX body to make fullscreen page from
        examples[id] = node.value;
      }
    });

    return examples;
  },
}

// TODO: Write some tests for example MDXAsts
