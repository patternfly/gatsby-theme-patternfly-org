const visit = require('unist-util-visit');
const mdxASTtoHAST = require('@mdx-js/mdx/mdx-ast-to-mdx-hast');
const { toJSX } = require('@mdx-js/mdx/mdx-hast-to-jsx');
const babel = require('@babel/core');

const getId = text => {
  return text.match(/\stitle=\"(.*?)"/)[1]
    .toLowerCase()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s+/g, '-');
}

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
  extractExamples: mdxAST => {
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
