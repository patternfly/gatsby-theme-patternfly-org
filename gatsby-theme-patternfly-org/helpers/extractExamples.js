const visit = require('unist-util-visit');
const mdxASTtoHAST = require('@mdx-js/mdx/mdx-ast-to-mdx-hast');
const { toJSX } = require('@mdx-js/mdx/mdx-hast-to-jsx');
const babel = require('@babel/core');

const getId = text => {
  return text.match(/\stitle="?(.*?)"?/)[1]
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
  extractCoreExamples: mdxAST => {

  },
  extractReactExamples: mdxAST => {
    const exampleMdxBodies = {};
    
    visit(mdxAST, 'code', node => {
      if (node.lang.includes('hbs')) {
        // To render fullscreen pages, we need only compile the HTML
        const exampleAST = {
          type: "root",
          children: []
        };
        exampleAST.children.push(node);
        exampleMdxBodies[getId(node.meta)] = renderMDXBody(exampleAST);
      }
    });

    return exampleMdxBodies;
  }
}

console.log(module.exports.extractExamples({
  "type": "root",
  "children": [
    {
      "type": "heading",
      "depth": 2,
      "children": [
        {
          "type": "text",
          "value": "Examples",
          "position": {
            "start": {
              "line": 2,
              "column": 4,
              "offset": 4
            },
            "end": {
              "line": 2,
              "column": 12,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 2,
          "column": 1,
          "offset": 1
        },
        "end": {
          "line": 2,
          "column": 12,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "code",
      "lang": "hbs",
      "meta": "title=\"Accordion-fluid-example\"",
      "value": "{{#> accordion}}\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item one{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item two{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item three{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--IsExpanded=\"true\" accordion-toggle--attribute='aria-expanded=\"true\"'}}\n    {{#> accordion-toggle-text}}Item four{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsExpanded=\"true\"}}\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie lorem lacinia dolor aliquet faucibus. Suspendisse gravida imperdiet accumsan. Aenean auctor lorem justo, vitae tincidunt enim blandit vel. Aenean quis tempus dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item five{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n{{/accordion}}",
      "position": {
        "start": {
          "line": 3,
          "column": 1,
          "offset": 13
        },
        "end": {
          "line": 45,
          "column": 4,
          "offset": 2060
        },
        "indent": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      }
    },
    {
      "type": "code",
      "lang": "hbs",
      "meta": "title=\"Accordion-fixed-example\"",
      "value": "{{#> accordion}}\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item one{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsFixed=\"true\"}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--IsExpanded=\"true\" accordion-toggle--attribute='aria-expanded=\"true\"'}}\n    {{#> accordion-toggle-text}}Item two{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsExpanded=\"true\" accordion-expanded-content--IsFixed=\"true\"}}\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie lorem lacinia dolor aliquet faucibus. Suspendisse gravida imperdiet accumsan. Aenean auctor lorem justo, vitae tincidunt enim blandit vel. Aenean quis tempus dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie lorem lacinia dolor aliquet faucibus. Suspendisse gravida imperdiet accumsan. Aenean auctor lorem justo, vitae tincidunt enim blandit vel. Aenean quis tempus dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie lorem lacinia dolor aliquet faucibus. Suspendisse gravida imperdiet accumsan. Aenean auctor lorem justo, vitae tincidunt enim blandit vel. Aenean quis tempus dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item three{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsFixed=\"true\"}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item four{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsFixed=\"true\"}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item five{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsFixed=\"true\"}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n{{/accordion}}",
      "position": {
        "start": {
          "line": 47,
          "column": 1,
          "offset": 2062
        },
        "end": {
          "line": 91,
          "column": 4,
          "offset": 4920
        },
        "indent": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      }
    },
    {
      "type": "code",
      "lang": "hbs",
      "meta": "title=\"Accordion-definition-list-example\"",
      "value": "{{#> accordion accordion--IsDefinitionList=\"true\"}}\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item one{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item two{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item three{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--IsExpanded=\"true\" accordion-toggle--attribute='aria-expanded=\"true\"'}}\n    {{#> accordion-toggle-text}}Item four{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content accordion-expanded-content--IsExpanded=\"true\"}}\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie lorem lacinia dolor aliquet faucibus. Suspendisse gravida imperdiet accumsan. Aenean auctor lorem justo, vitae tincidunt enim blandit vel. Aenean quis tempus dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n  {{/accordion-expanded-content}}\n\n  {{#> accordion-toggle accordion-toggle--attribute='aria-expanded=\"false\"'}}\n    {{#> accordion-toggle-text}}Item five{{/accordion-toggle-text}}\n    {{#> accordion-toggle-icon}}{{/accordion-toggle-icon}}\n  {{/accordion-toggle}}\n  {{#> accordion-expanded-content}}\n    This text is hidden\n  {{/accordion-expanded-content}}\n{{/accordion}}",
      "position": {
        "start": {
          "line": 93,
          "column": 1,
          "offset": 4922
        },
        "end": {
          "line": 135,
          "column": 4,
          "offset": 7014
        },
        "indent": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      }
    },
    {
      "type": "heading",
      "depth": 2,
      "children": [
        {
          "type": "text",
          "value": "Documentation",
          "position": {
            "start": {
              "line": 137,
              "column": 4,
              "offset": 7019
            },
            "end": {
              "line": 137,
              "column": 17,
              "offset": 7032
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 137,
          "column": 1,
          "offset": 7016
        },
        "end": {
          "line": 137,
          "column": 17,
          "offset": 7032
        },
        "indent": []
      }
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Overview",
          "position": {
            "start": {
              "line": 138,
              "column": 5,
              "offset": 7037
            },
            "end": {
              "line": 138,
              "column": 13,
              "offset": 7045
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 138,
          "column": 1,
          "offset": 7033
        },
        "end": {
          "line": 138,
          "column": 13,
          "offset": 7045
        },
        "indent": []
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "There are two variations to build the accordion component:\nOne way uses ",
          "position": {
            "start": {
              "line": 140,
              "column": 1,
              "offset": 7047
            },
            "end": {
              "line": 141,
              "column": 14,
              "offset": 7119
            },
            "indent": [
              1
            ]
          }
        },
        {
          "type": "inlineCode",
          "value": "<div>",
          "position": {
            "start": {
              "line": 141,
              "column": 14,
              "offset": 7119
            },
            "end": {
              "line": 141,
              "column": 21,
              "offset": 7126
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " and ",
          "position": {
            "start": {
              "line": 141,
              "column": 21,
              "offset": 7126
            },
            "end": {
              "line": 141,
              "column": 26,
              "offset": 7131
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<h1 - h6>",
          "position": {
            "start": {
              "line": 141,
              "column": 26,
              "offset": 7131
            },
            "end": {
              "line": 141,
              "column": 37,
              "offset": 7142
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " tags to build the component. \nIn these examples ",
          "position": {
            "start": {
              "line": 141,
              "column": 37,
              "offset": 7142
            },
            "end": {
              "line": 142,
              "column": 19,
              "offset": 7191
            },
            "indent": [
              1
            ]
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion",
          "position": {
            "start": {
              "line": 142,
              "column": 19,
              "offset": 7191
            },
            "end": {
              "line": 142,
              "column": 36,
              "offset": 7208
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 142,
              "column": 36,
              "offset": 7208
            },
            "end": {
              "line": 142,
              "column": 42,
              "offset": 7214
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<div>",
          "position": {
            "start": {
              "line": 142,
              "column": 42,
              "offset": 7214
            },
            "end": {
              "line": 142,
              "column": 49,
              "offset": 7221
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ", ",
          "position": {
            "start": {
              "line": 142,
              "column": 49,
              "offset": 7221
            },
            "end": {
              "line": 142,
              "column": 51,
              "offset": 7223
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion__toggle",
          "position": {
            "start": {
              "line": 142,
              "column": 51,
              "offset": 7223
            },
            "end": {
              "line": 142,
              "column": 76,
              "offset": 7248
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 142,
              "column": 76,
              "offset": 7248
            },
            "end": {
              "line": 142,
              "column": 82,
              "offset": 7254
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<h3><button>",
          "position": {
            "start": {
              "line": 142,
              "column": 82,
              "offset": 7254
            },
            "end": {
              "line": 142,
              "column": 96,
              "offset": 7268
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ", and ",
          "position": {
            "start": {
              "line": 142,
              "column": 96,
              "offset": 7268
            },
            "end": {
              "line": 142,
              "column": 102,
              "offset": 7274
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion__expanded-content",
          "position": {
            "start": {
              "line": 142,
              "column": 102,
              "offset": 7274
            },
            "end": {
              "line": 142,
              "column": 137,
              "offset": 7309
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 142,
              "column": 137,
              "offset": 7309
            },
            "end": {
              "line": 142,
              "column": 143,
              "offset": 7315
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<div>",
          "position": {
            "start": {
              "line": 142,
              "column": 143,
              "offset": 7315
            },
            "end": {
              "line": 142,
              "column": 150,
              "offset": 7322
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ". The heading level that you use should fit within the rest of the headings outlined on your page.",
          "position": {
            "start": {
              "line": 142,
              "column": 150,
              "offset": 7322
            },
            "end": {
              "line": 142,
              "column": 248,
              "offset": 7420
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 140,
          "column": 1,
          "offset": 7047
        },
        "end": {
          "line": 142,
          "column": 248,
          "offset": 7420
        },
        "indent": [
          1,
          1
        ]
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Another variation is using the definition list:\nIn these examples ",
          "position": {
            "start": {
              "line": 144,
              "column": 1,
              "offset": 7422
            },
            "end": {
              "line": 145,
              "column": 19,
              "offset": 7488
            },
            "indent": [
              1
            ]
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion",
          "position": {
            "start": {
              "line": 145,
              "column": 19,
              "offset": 7488
            },
            "end": {
              "line": 145,
              "column": 36,
              "offset": 7505
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 145,
              "column": 36,
              "offset": 7505
            },
            "end": {
              "line": 145,
              "column": 42,
              "offset": 7511
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<dl>",
          "position": {
            "start": {
              "line": 145,
              "column": 42,
              "offset": 7511
            },
            "end": {
              "line": 145,
              "column": 48,
              "offset": 7517
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ", ",
          "position": {
            "start": {
              "line": 145,
              "column": 48,
              "offset": 7517
            },
            "end": {
              "line": 145,
              "column": 50,
              "offset": 7519
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion__toggle",
          "position": {
            "start": {
              "line": 145,
              "column": 50,
              "offset": 7519
            },
            "end": {
              "line": 145,
              "column": 75,
              "offset": 7544
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 145,
              "column": 75,
              "offset": 7544
            },
            "end": {
              "line": 145,
              "column": 81,
              "offset": 7550
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<dt><button>",
          "position": {
            "start": {
              "line": 145,
              "column": 81,
              "offset": 7550
            },
            "end": {
              "line": 145,
              "column": 95,
              "offset": 7564
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ", and ",
          "position": {
            "start": {
              "line": 145,
              "column": 95,
              "offset": 7564
            },
            "end": {
              "line": 145,
              "column": 101,
              "offset": 7570
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": ".pf-c-accordion__expanded-content",
          "position": {
            "start": {
              "line": 145,
              "column": 101,
              "offset": 7570
            },
            "end": {
              "line": 145,
              "column": 136,
              "offset": 7605
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": " uses ",
          "position": {
            "start": {
              "line": 145,
              "column": 136,
              "offset": 7605
            },
            "end": {
              "line": 145,
              "column": 142,
              "offset": 7611
            },
            "indent": []
          }
        },
        {
          "type": "inlineCode",
          "value": "<dd>",
          "position": {
            "start": {
              "line": 145,
              "column": 142,
              "offset": 7611
            },
            "end": {
              "line": 145,
              "column": 148,
              "offset": 7617
            },
            "indent": []
          }
        },
        {
          "type": "text",
          "value": ".",
          "position": {
            "start": {
              "line": 145,
              "column": 148,
              "offset": 7617
            },
            "end": {
              "line": 145,
              "column": 149,
              "offset": 7618
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 144,
          "column": 1,
          "offset": 7422
        },
        "end": {
          "line": 145,
          "column": 149,
          "offset": 7618
        },
        "indent": [
          1
        ]
      }
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Accessibility",
          "position": {
            "start": {
              "line": 147,
              "column": 5,
              "offset": 7624
            },
            "end": {
              "line": 147,
              "column": 18,
              "offset": 7637
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 147,
          "column": 1,
          "offset": 7620
        },
        "end": {
          "line": 147,
          "column": 18,
          "offset": 7637
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "align": [
        null,
        null,
        null
      ],
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Attribute",
                  "position": {
                    "start": {
                      "line": 149,
                      "column": 3,
                      "offset": 7641
                    },
                    "end": {
                      "line": 149,
                      "column": 12,
                      "offset": 7650
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 149,
                  "column": 3,
                  "offset": 7641
                },
                "end": {
                  "line": 149,
                  "column": 12,
                  "offset": 7650
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Applied to",
                  "position": {
                    "start": {
                      "line": 149,
                      "column": 15,
                      "offset": 7653
                    },
                    "end": {
                      "line": 149,
                      "column": 25,
                      "offset": 7663
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 149,
                  "column": 15,
                  "offset": 7653
                },
                "end": {
                  "line": 149,
                  "column": 25,
                  "offset": 7663
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Outcome",
                  "position": {
                    "start": {
                      "line": 149,
                      "column": 28,
                      "offset": 7666
                    },
                    "end": {
                      "line": 149,
                      "column": 35,
                      "offset": 7673
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 149,
                  "column": 28,
                  "offset": 7666
                },
                "end": {
                  "line": 149,
                  "column": 35,
                  "offset": 7673
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 149,
              "column": 1,
              "offset": 7639
            },
            "end": {
              "line": 149,
              "column": 37,
              "offset": 7675
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "aria-expanded=\"false\"",
                  "position": {
                    "start": {
                      "line": 151,
                      "column": 3,
                      "offset": 7695
                    },
                    "end": {
                      "line": 151,
                      "column": 26,
                      "offset": 7718
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 151,
                  "column": 3,
                  "offset": 7695
                },
                "end": {
                  "line": 151,
                  "column": 26,
                  "offset": 7718
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 151,
                      "column": 29,
                      "offset": 7721
                    },
                    "end": {
                      "line": 151,
                      "column": 54,
                      "offset": 7746
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 151,
                  "column": 29,
                  "offset": 7721
                },
                "end": {
                  "line": 151,
                  "column": 54,
                  "offset": 7746
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Indicates that the expanded content element is hidden. ",
                  "position": {
                    "start": {
                      "line": 151,
                      "column": 57,
                      "offset": 7749
                    },
                    "end": {
                      "line": 151,
                      "column": 112,
                      "offset": 7804
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 151,
                          "column": 114,
                          "offset": 7806
                        },
                        "end": {
                          "line": 151,
                          "column": 122,
                          "offset": 7814
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 151,
                      "column": 112,
                      "offset": 7804
                    },
                    "end": {
                      "line": 151,
                      "column": 124,
                      "offset": 7816
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 151,
                  "column": 57,
                  "offset": 7749
                },
                "end": {
                  "line": 151,
                  "column": 124,
                  "offset": 7816
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 151,
              "column": 1,
              "offset": 7693
            },
            "end": {
              "line": 151,
              "column": 125,
              "offset": 7817
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "aria-expanded=\"true\"",
                  "position": {
                    "start": {
                      "line": 152,
                      "column": 3,
                      "offset": 7820
                    },
                    "end": {
                      "line": 152,
                      "column": 25,
                      "offset": 7842
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 152,
                  "column": 3,
                  "offset": 7820
                },
                "end": {
                  "line": 152,
                  "column": 25,
                  "offset": 7842
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 152,
                      "column": 28,
                      "offset": 7845
                    },
                    "end": {
                      "line": 152,
                      "column": 53,
                      "offset": 7870
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 152,
                  "column": 28,
                  "offset": 7845
                },
                "end": {
                  "line": 152,
                  "column": 53,
                  "offset": 7870
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Indicates that the expanded content element is visible. ",
                  "position": {
                    "start": {
                      "line": 152,
                      "column": 56,
                      "offset": 7873
                    },
                    "end": {
                      "line": 152,
                      "column": 112,
                      "offset": 7929
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 152,
                          "column": 114,
                          "offset": 7931
                        },
                        "end": {
                          "line": 152,
                          "column": 122,
                          "offset": 7939
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 152,
                      "column": 112,
                      "offset": 7929
                    },
                    "end": {
                      "line": 152,
                      "column": 124,
                      "offset": 7941
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 152,
                  "column": 56,
                  "offset": 7873
                },
                "end": {
                  "line": 152,
                  "column": 124,
                  "offset": 7941
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 152,
              "column": 1,
              "offset": 7818
            },
            "end": {
              "line": 152,
              "column": 125,
              "offset": 7942
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "hidden",
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 3,
                      "offset": 7945
                    },
                    "end": {
                      "line": 153,
                      "column": 11,
                      "offset": 7953
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 153,
                  "column": 3,
                  "offset": 7945
                },
                "end": {
                  "line": 153,
                  "column": 11,
                  "offset": 7953
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__expanded-content",
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 14,
                      "offset": 7956
                    },
                    "end": {
                      "line": 153,
                      "column": 49,
                      "offset": 7991
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 153,
                  "column": 14,
                  "offset": 7956
                },
                "end": {
                  "line": 153,
                  "column": 49,
                  "offset": 7991
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Indicates that the expanded content element is hidden. Use with ",
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 52,
                      "offset": 7994
                    },
                    "end": {
                      "line": 153,
                      "column": 116,
                      "offset": 8058
                    },
                    "indent": []
                  }
                },
                {
                  "type": "inlineCode",
                  "value": "aria-expanded=\"false\"",
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 116,
                      "offset": 8058
                    },
                    "end": {
                      "line": 153,
                      "column": 139,
                      "offset": 8081
                    },
                    "indent": []
                  }
                },
                {
                  "type": "text",
                  "value": " ",
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 139,
                      "offset": 8081
                    },
                    "end": {
                      "line": 153,
                      "column": 140,
                      "offset": 8082
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 153,
                          "column": 142,
                          "offset": 8084
                        },
                        "end": {
                          "line": 153,
                          "column": 150,
                          "offset": 8092
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 153,
                      "column": 140,
                      "offset": 8082
                    },
                    "end": {
                      "line": 153,
                      "column": 152,
                      "offset": 8094
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 153,
                  "column": 52,
                  "offset": 7994
                },
                "end": {
                  "line": 153,
                  "column": 152,
                  "offset": 8094
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 153,
              "column": 1,
              "offset": 7943
            },
            "end": {
              "line": 153,
              "column": 154,
              "offset": 8096
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "aria-hidden=\"true\"",
                  "position": {
                    "start": {
                      "line": 154,
                      "column": 3,
                      "offset": 8099
                    },
                    "end": {
                      "line": 154,
                      "column": 23,
                      "offset": 8119
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 154,
                  "column": 3,
                  "offset": 8099
                },
                "end": {
                  "line": 154,
                  "column": 23,
                  "offset": 8119
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle-icon",
                  "position": {
                    "start": {
                      "line": 154,
                      "column": 26,
                      "offset": 8122
                    },
                    "end": {
                      "line": 154,
                      "column": 56,
                      "offset": 8152
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 154,
                  "column": 26,
                  "offset": 8122
                },
                "end": {
                  "line": 154,
                  "column": 56,
                  "offset": 8152
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Hides the icon from assistive technologies.",
                  "position": {
                    "start": {
                      "line": 154,
                      "column": 59,
                      "offset": 8155
                    },
                    "end": {
                      "line": 154,
                      "column": 102,
                      "offset": 8198
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 154,
                          "column": 104,
                          "offset": 8200
                        },
                        "end": {
                          "line": 154,
                          "column": 112,
                          "offset": 8208
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 154,
                      "column": 102,
                      "offset": 8198
                    },
                    "end": {
                      "line": 154,
                      "column": 114,
                      "offset": 8210
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 154,
                  "column": 59,
                  "offset": 8155
                },
                "end": {
                  "line": 154,
                  "column": 114,
                  "offset": 8210
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 154,
              "column": 1,
              "offset": 8097
            },
            "end": {
              "line": 154,
              "column": 116,
              "offset": 8212
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 149,
          "column": 1,
          "offset": 7639
        },
        "end": {
          "line": 154,
          "column": 116,
          "offset": 8212
        },
        "indent": [
          1,
          1,
          1,
          1,
          1
        ]
      }
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Usage",
          "position": {
            "start": {
              "line": 156,
              "column": 5,
              "offset": 8218
            },
            "end": {
              "line": 156,
              "column": 10,
              "offset": 8223
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 156,
          "column": 1,
          "offset": 8214
        },
        "end": {
          "line": 156,
          "column": 10,
          "offset": 8223
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "align": [
        null,
        null,
        null
      ],
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Class",
                  "position": {
                    "start": {
                      "line": 158,
                      "column": 3,
                      "offset": 8227
                    },
                    "end": {
                      "line": 158,
                      "column": 8,
                      "offset": 8232
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 158,
                  "column": 3,
                  "offset": 8227
                },
                "end": {
                  "line": 158,
                  "column": 8,
                  "offset": 8232
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Applied to",
                  "position": {
                    "start": {
                      "line": 158,
                      "column": 11,
                      "offset": 8235
                    },
                    "end": {
                      "line": 158,
                      "column": 21,
                      "offset": 8245
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 158,
                  "column": 11,
                  "offset": 8235
                },
                "end": {
                  "line": 158,
                  "column": 21,
                  "offset": 8245
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Outcome",
                  "position": {
                    "start": {
                      "line": 158,
                      "column": 24,
                      "offset": 8248
                    },
                    "end": {
                      "line": 158,
                      "column": 31,
                      "offset": 8255
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 158,
                  "column": 24,
                  "offset": 8248
                },
                "end": {
                  "line": 158,
                  "column": 31,
                  "offset": 8255
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 158,
              "column": 1,
              "offset": 8225
            },
            "end": {
              "line": 158,
              "column": 33,
              "offset": 8257
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion",
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 3,
                      "offset": 8277
                    },
                    "end": {
                      "line": 160,
                      "column": 20,
                      "offset": 8294
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 160,
                  "column": 3,
                  "offset": 8277
                },
                "end": {
                  "line": 160,
                  "column": 20,
                  "offset": 8294
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<div>",
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 23,
                      "offset": 8297
                    },
                    "end": {
                      "line": 160,
                      "column": 30,
                      "offset": 8304
                    },
                    "indent": []
                  }
                },
                {
                  "type": "text",
                  "value": ", ",
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 30,
                      "offset": 8304
                    },
                    "end": {
                      "line": 160,
                      "column": 32,
                      "offset": 8306
                    },
                    "indent": []
                  }
                },
                {
                  "type": "inlineCode",
                  "value": "<dl>",
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 32,
                      "offset": 8306
                    },
                    "end": {
                      "line": 160,
                      "column": 38,
                      "offset": 8312
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 160,
                  "column": 23,
                  "offset": 8297
                },
                "end": {
                  "line": 160,
                  "column": 38,
                  "offset": 8312
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates an accordion component. ",
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 41,
                      "offset": 8315
                    },
                    "end": {
                      "line": 160,
                      "column": 75,
                      "offset": 8349
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 160,
                          "column": 77,
                          "offset": 8351
                        },
                        "end": {
                          "line": 160,
                          "column": 85,
                          "offset": 8359
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 160,
                      "column": 75,
                      "offset": 8349
                    },
                    "end": {
                      "line": 160,
                      "column": 87,
                      "offset": 8361
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 160,
                  "column": 41,
                  "offset": 8315
                },
                "end": {
                  "line": 160,
                  "column": 87,
                  "offset": 8361
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 160,
              "column": 1,
              "offset": 8275
            },
            "end": {
              "line": 160,
              "column": 88,
              "offset": 8362
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 3,
                      "offset": 8365
                    },
                    "end": {
                      "line": 161,
                      "column": 28,
                      "offset": 8390
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 161,
                  "column": 3,
                  "offset": 8365
                },
                "end": {
                  "line": 161,
                  "column": 28,
                  "offset": 8390
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<h1-h6><button>",
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 31,
                      "offset": 8393
                    },
                    "end": {
                      "line": 161,
                      "column": 48,
                      "offset": 8410
                    },
                    "indent": []
                  }
                },
                {
                  "type": "text",
                  "value": ", ",
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 48,
                      "offset": 8410
                    },
                    "end": {
                      "line": 161,
                      "column": 50,
                      "offset": 8412
                    },
                    "indent": []
                  }
                },
                {
                  "type": "inlineCode",
                  "value": "<dt><button>",
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 50,
                      "offset": 8412
                    },
                    "end": {
                      "line": 161,
                      "column": 64,
                      "offset": 8426
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 161,
                  "column": 31,
                  "offset": 8393
                },
                "end": {
                  "line": 161,
                  "column": 64,
                  "offset": 8426
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates a toggle in the accordion. ",
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 67,
                      "offset": 8429
                    },
                    "end": {
                      "line": 161,
                      "column": 104,
                      "offset": 8466
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 161,
                          "column": 106,
                          "offset": 8468
                        },
                        "end": {
                          "line": 161,
                          "column": 114,
                          "offset": 8476
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 161,
                      "column": 104,
                      "offset": 8466
                    },
                    "end": {
                      "line": 161,
                      "column": 116,
                      "offset": 8478
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 161,
                  "column": 67,
                  "offset": 8429
                },
                "end": {
                  "line": 161,
                  "column": 116,
                  "offset": 8478
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 161,
              "column": 1,
              "offset": 8363
            },
            "end": {
              "line": 161,
              "column": 118,
              "offset": 8480
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle-text",
                  "position": {
                    "start": {
                      "line": 162,
                      "column": 3,
                      "offset": 8483
                    },
                    "end": {
                      "line": 162,
                      "column": 33,
                      "offset": 8513
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 162,
                  "column": 3,
                  "offset": 8483
                },
                "end": {
                  "line": 162,
                  "column": 33,
                  "offset": 8513
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<span>",
                  "position": {
                    "start": {
                      "line": 162,
                      "column": 36,
                      "offset": 8516
                    },
                    "end": {
                      "line": 162,
                      "column": 44,
                      "offset": 8524
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 162,
                  "column": 36,
                  "offset": 8516
                },
                "end": {
                  "line": 162,
                  "column": 44,
                  "offset": 8524
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates the text inside the toggle. ",
                  "position": {
                    "start": {
                      "line": 162,
                      "column": 47,
                      "offset": 8527
                    },
                    "end": {
                      "line": 162,
                      "column": 85,
                      "offset": 8565
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 162,
                          "column": 87,
                          "offset": 8567
                        },
                        "end": {
                          "line": 162,
                          "column": 95,
                          "offset": 8575
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 162,
                      "column": 85,
                      "offset": 8565
                    },
                    "end": {
                      "line": 162,
                      "column": 97,
                      "offset": 8577
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 162,
                  "column": 47,
                  "offset": 8527
                },
                "end": {
                  "line": 162,
                  "column": 97,
                  "offset": 8577
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 162,
              "column": 1,
              "offset": 8481
            },
            "end": {
              "line": 162,
              "column": 99,
              "offset": 8579
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle-icon",
                  "position": {
                    "start": {
                      "line": 163,
                      "column": 3,
                      "offset": 8582
                    },
                    "end": {
                      "line": 163,
                      "column": 33,
                      "offset": 8612
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 163,
                  "column": 3,
                  "offset": 8582
                },
                "end": {
                  "line": 163,
                  "column": 33,
                  "offset": 8612
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<i>",
                  "position": {
                    "start": {
                      "line": 163,
                      "column": 36,
                      "offset": 8615
                    },
                    "end": {
                      "line": 163,
                      "column": 41,
                      "offset": 8620
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 163,
                  "column": 36,
                  "offset": 8615
                },
                "end": {
                  "line": 163,
                  "column": 41,
                  "offset": 8620
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates the toggle icon. ",
                  "position": {
                    "start": {
                      "line": 163,
                      "column": 44,
                      "offset": 8623
                    },
                    "end": {
                      "line": 163,
                      "column": 71,
                      "offset": 8650
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 163,
                          "column": 73,
                          "offset": 8652
                        },
                        "end": {
                          "line": 163,
                          "column": 81,
                          "offset": 8660
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 163,
                      "column": 71,
                      "offset": 8650
                    },
                    "end": {
                      "line": 163,
                      "column": 83,
                      "offset": 8662
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 163,
                  "column": 44,
                  "offset": 8623
                },
                "end": {
                  "line": 163,
                  "column": 83,
                  "offset": 8662
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 163,
              "column": 1,
              "offset": 8580
            },
            "end": {
              "line": 163,
              "column": 85,
              "offset": 8664
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__expanded-content",
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 3,
                      "offset": 8667
                    },
                    "end": {
                      "line": 164,
                      "column": 38,
                      "offset": 8702
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 164,
                  "column": 3,
                  "offset": 8667
                },
                "end": {
                  "line": 164,
                  "column": 38,
                  "offset": 8702
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<div>",
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 41,
                      "offset": 8705
                    },
                    "end": {
                      "line": 164,
                      "column": 48,
                      "offset": 8712
                    },
                    "indent": []
                  }
                },
                {
                  "type": "text",
                  "value": ", ",
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 48,
                      "offset": 8712
                    },
                    "end": {
                      "line": 164,
                      "column": 50,
                      "offset": 8714
                    },
                    "indent": []
                  }
                },
                {
                  "type": "inlineCode",
                  "value": "<dd>",
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 50,
                      "offset": 8714
                    },
                    "end": {
                      "line": 164,
                      "column": 56,
                      "offset": 8720
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 164,
                  "column": 41,
                  "offset": 8705
                },
                "end": {
                  "line": 164,
                  "column": 56,
                  "offset": 8720
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates expanded content. ",
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 59,
                      "offset": 8723
                    },
                    "end": {
                      "line": 164,
                      "column": 87,
                      "offset": 8751
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Must be paired with a button",
                      "position": {
                        "start": {
                          "line": 164,
                          "column": 89,
                          "offset": 8753
                        },
                        "end": {
                          "line": 164,
                          "column": 117,
                          "offset": 8781
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 164,
                      "column": 87,
                      "offset": 8751
                    },
                    "end": {
                      "line": 164,
                      "column": 119,
                      "offset": 8783
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 164,
                  "column": 59,
                  "offset": 8723
                },
                "end": {
                  "line": 164,
                  "column": 119,
                  "offset": 8783
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 164,
              "column": 1,
              "offset": 8665
            },
            "end": {
              "line": 164,
              "column": 121,
              "offset": 8785
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__expanded-content-body",
                  "position": {
                    "start": {
                      "line": 165,
                      "column": 3,
                      "offset": 8788
                    },
                    "end": {
                      "line": 165,
                      "column": 43,
                      "offset": 8828
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 165,
                  "column": 3,
                  "offset": 8788
                },
                "end": {
                  "line": 165,
                  "column": 43,
                  "offset": 8828
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": "<div>",
                  "position": {
                    "start": {
                      "line": 165,
                      "column": 46,
                      "offset": 8831
                    },
                    "end": {
                      "line": 165,
                      "column": 53,
                      "offset": 8838
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 165,
                  "column": 46,
                  "offset": 8831
                },
                "end": {
                  "line": 165,
                  "column": 53,
                  "offset": 8838
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Initiates expanded content body. ",
                  "position": {
                    "start": {
                      "line": 165,
                      "column": 56,
                      "offset": 8841
                    },
                    "end": {
                      "line": 165,
                      "column": 89,
                      "offset": 8874
                    },
                    "indent": []
                  }
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "Required",
                      "position": {
                        "start": {
                          "line": 165,
                          "column": 91,
                          "offset": 8876
                        },
                        "end": {
                          "line": 165,
                          "column": 99,
                          "offset": 8884
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 165,
                      "column": 89,
                      "offset": 8874
                    },
                    "end": {
                      "line": 165,
                      "column": 101,
                      "offset": 8886
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 165,
                  "column": 56,
                  "offset": 8841
                },
                "end": {
                  "line": 165,
                  "column": 101,
                  "offset": 8886
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 165,
              "column": 1,
              "offset": 8786
            },
            "end": {
              "line": 165,
              "column": 103,
              "offset": 8888
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-m-expanded",
                  "position": {
                    "start": {
                      "line": 166,
                      "column": 3,
                      "offset": 8891
                    },
                    "end": {
                      "line": 166,
                      "column": 19,
                      "offset": 8907
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 166,
                  "column": 3,
                  "offset": 8891
                },
                "end": {
                  "line": 166,
                  "column": 19,
                  "offset": 8907
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 166,
                      "column": 22,
                      "offset": 8910
                    },
                    "end": {
                      "line": 166,
                      "column": 47,
                      "offset": 8935
                    },
                    "indent": []
                  }
                },
                {
                  "type": "text",
                  "value": ", ",
                  "position": {
                    "start": {
                      "line": 166,
                      "column": 47,
                      "offset": 8935
                    },
                    "end": {
                      "line": 166,
                      "column": 49,
                      "offset": 8937
                    },
                    "indent": []
                  }
                },
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__expanded-content",
                  "position": {
                    "start": {
                      "line": 166,
                      "column": 49,
                      "offset": 8937
                    },
                    "end": {
                      "line": 166,
                      "column": 84,
                      "offset": 8972
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 166,
                  "column": 22,
                  "offset": 8910
                },
                "end": {
                  "line": 166,
                  "column": 84,
                  "offset": 8972
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Modifies the accordion button and expanded content for the expanded state.",
                  "position": {
                    "start": {
                      "line": 166,
                      "column": 87,
                      "offset": 8975
                    },
                    "end": {
                      "line": 166,
                      "column": 161,
                      "offset": 9049
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 166,
                  "column": 87,
                  "offset": 8975
                },
                "end": {
                  "line": 166,
                  "column": 161,
                  "offset": 9049
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 166,
              "column": 1,
              "offset": 8889
            },
            "end": {
              "line": 166,
              "column": 163,
              "offset": 9051
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-m-hover",
                  "position": {
                    "start": {
                      "line": 167,
                      "column": 3,
                      "offset": 9054
                    },
                    "end": {
                      "line": 167,
                      "column": 16,
                      "offset": 9067
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 167,
                  "column": 3,
                  "offset": 9054
                },
                "end": {
                  "line": 167,
                  "column": 16,
                  "offset": 9067
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 167,
                      "column": 19,
                      "offset": 9070
                    },
                    "end": {
                      "line": 167,
                      "column": 44,
                      "offset": 9095
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 167,
                  "column": 19,
                  "offset": 9070
                },
                "end": {
                  "line": 167,
                  "column": 44,
                  "offset": 9095
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Modifies the accordion button for the hover state.",
                  "position": {
                    "start": {
                      "line": 167,
                      "column": 47,
                      "offset": 9098
                    },
                    "end": {
                      "line": 167,
                      "column": 97,
                      "offset": 9148
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 167,
                  "column": 47,
                  "offset": 9098
                },
                "end": {
                  "line": 167,
                  "column": 97,
                  "offset": 9148
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 167,
              "column": 1,
              "offset": 9052
            },
            "end": {
              "line": 167,
              "column": 99,
              "offset": 9150
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-m-active",
                  "position": {
                    "start": {
                      "line": 168,
                      "column": 3,
                      "offset": 9153
                    },
                    "end": {
                      "line": 168,
                      "column": 17,
                      "offset": 9167
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 168,
                  "column": 3,
                  "offset": 9153
                },
                "end": {
                  "line": 168,
                  "column": 17,
                  "offset": 9167
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 168,
                      "column": 20,
                      "offset": 9170
                    },
                    "end": {
                      "line": 168,
                      "column": 45,
                      "offset": 9195
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 168,
                  "column": 20,
                  "offset": 9170
                },
                "end": {
                  "line": 168,
                  "column": 45,
                  "offset": 9195
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Modifies the accordion button for the active state.",
                  "position": {
                    "start": {
                      "line": 168,
                      "column": 48,
                      "offset": 9198
                    },
                    "end": {
                      "line": 168,
                      "column": 99,
                      "offset": 9249
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 168,
                  "column": 48,
                  "offset": 9198
                },
                "end": {
                  "line": 168,
                  "column": 99,
                  "offset": 9249
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 168,
              "column": 1,
              "offset": 9151
            },
            "end": {
              "line": 168,
              "column": 101,
              "offset": 9251
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-m-focus",
                  "position": {
                    "start": {
                      "line": 169,
                      "column": 3,
                      "offset": 9254
                    },
                    "end": {
                      "line": 169,
                      "column": 16,
                      "offset": 9267
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 169,
                  "column": 3,
                  "offset": 9254
                },
                "end": {
                  "line": 169,
                  "column": 16,
                  "offset": 9267
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__toggle",
                  "position": {
                    "start": {
                      "line": 169,
                      "column": 19,
                      "offset": 9270
                    },
                    "end": {
                      "line": 169,
                      "column": 44,
                      "offset": 9295
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 169,
                  "column": 19,
                  "offset": 9270
                },
                "end": {
                  "line": 169,
                  "column": 44,
                  "offset": 9295
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Modifies the accordion button for the focus state.",
                  "position": {
                    "start": {
                      "line": 169,
                      "column": 47,
                      "offset": 9298
                    },
                    "end": {
                      "line": 169,
                      "column": 97,
                      "offset": 9348
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 169,
                  "column": 47,
                  "offset": 9298
                },
                "end": {
                  "line": 169,
                  "column": 97,
                  "offset": 9348
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 169,
              "column": 1,
              "offset": 9252
            },
            "end": {
              "line": 169,
              "column": 99,
              "offset": 9350
            },
            "indent": []
          }
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-m-fixed",
                  "position": {
                    "start": {
                      "line": 170,
                      "column": 3,
                      "offset": 9353
                    },
                    "end": {
                      "line": 170,
                      "column": 16,
                      "offset": 9366
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 170,
                  "column": 3,
                  "offset": 9353
                },
                "end": {
                  "line": 170,
                  "column": 16,
                  "offset": 9366
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "inlineCode",
                  "value": ".pf-c-accordion__expanded-content",
                  "position": {
                    "start": {
                      "line": 170,
                      "column": 19,
                      "offset": 9369
                    },
                    "end": {
                      "line": 170,
                      "column": 54,
                      "offset": 9404
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 170,
                  "column": 19,
                  "offset": 9369
                },
                "end": {
                  "line": 170,
                  "column": 54,
                  "offset": 9404
                },
                "indent": []
              }
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Modifies the expanded content for the fixed state.",
                  "position": {
                    "start": {
                      "line": 170,
                      "column": 57,
                      "offset": 9407
                    },
                    "end": {
                      "line": 170,
                      "column": 107,
                      "offset": 9457
                    },
                    "indent": []
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 170,
                  "column": 57,
                  "offset": 9407
                },
                "end": {
                  "line": 170,
                  "column": 107,
                  "offset": 9457
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 170,
              "column": 1,
              "offset": 9351
            },
            "end": {
              "line": 170,
              "column": 109,
              "offset": 9459
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 158,
          "column": 1,
          "offset": 8225
        },
        "end": {
          "line": 170,
          "column": 109,
          "offset": 9459
        },
        "indent": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ]
      }
    },
    {
      "type": "export",
      "value": "export const _frontmatter = {\"title\":\"Accordion\",\"section\":\"components\",\"cssPrefix\":\"pf-c-accordion\"}",
      "position": {
        "start": {
          "line": 173,
          "column": 1,
          "offset": 9462
        },
        "end": {
          "line": 173,
          "column": 102,
          "offset": 9563
        },
        "indent": []
      }
    }
  ],
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 173,
      "column": 102,
      "offset": 9563
    }
  }
}
))