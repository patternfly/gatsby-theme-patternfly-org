// https://www.gatsbyjs.org/docs/ssr-apis

exports.onRenderBody = ({ setHtmlAttributes }) => {
  // Always en-us
  setHtmlAttributes({
    lang: 'en-us'
  });
  // Always use new Red Hat font
  setHtmlAttributes({
    className: 'pf-m-redhat-font'
  });
}