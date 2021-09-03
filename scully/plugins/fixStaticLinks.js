const { registerPlugin } = require('@scullyio/scully');

const fixStaticLinksPlugin = async (html) => {
  const regex = new RegExp('(<a[^>]* href="\/)([^"]*)"', 'gmi');
  html = html.replace(regex, `$1${process.env.LOCALE}/$2"`);

  return Promise.resolve(html);
};

registerPlugin('render', 'fixStaticLinks', fixStaticLinksPlugin);
module.exports.fixStaticLinksPlugin = fixStaticLinksPlugin;