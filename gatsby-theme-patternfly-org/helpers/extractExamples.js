const visit = require('unist-util-visit');
const mdxASTtoHAST = require('@mdx-js/mdx/mdx-ast-to-mdx-hast');
const { toJSX } = require('@mdx-js/mdx/mdx-hast-to-jsx');
const babel = require('@babel/core');
const { getId } = require('./getId');

/* https://github.com/mdx-js/specification
 *
 * Our goal is to take an AST and produce a string that looks
 * like whatever `body` looks like in gatsby-plugin-mdx.
 * 
 * Will this break with future versions of gatsby-plugin-mdx? Probably.
 * But for now, it wants some helpers and then `return mdx(...)`
 */
const renderMDXBody = exampleAST => {
  const jsx = toJSX(mdxASTtoHAST()(exampleAST));
  // This jsx has to be transformed to use mdx() calls
  return babel.transform(jsx, {
    plugins: [["@babel/plugin-transform-react-jsx", {
      pragma: "mdx"
    }]]
  }).code.replace('export default', 'return');
}

module.exports = {
  // Map example page urls to HTML
  extractCoreExamples: (mdxAST, hbsInstance) => {
    const exampleHTML = {};

    visit(mdxAST, 'code', node => {
      if (node.lang === 'hbs') {
        const html = hbsInstance.compile(node.value)({});
        // Add the html to the object that fullscreen pages get created from
        exampleHTML[getId(node.meta.match(/title=(\S*)/)[1])] = html;
      }
    });

    return exampleHTML;
  },
  extractReactExamples: mdxAST => {
    const exampleMdxBodies = {};
    
    visit(mdxAST, 'jsx', node => {
      if (node.value.includes('<Example')) {
        const exampleAST = {
          type: "root",
          children: []
        };
        exampleAST.children.push(node);
        exampleMdxBodies[getId(node.value)] = renderMDXBody(exampleAST);
      }
    });

    return exampleMdxBodies;
  }
}

// TODO: Write some tests for example MDXAsts
// console.log(module.exports.extractCoreExamples({
// }, hbsInstance))