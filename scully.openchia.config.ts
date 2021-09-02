import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { MinifyHtml } from 'scully-plugin-minify-html';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';

require('./scully/plugins/fixStaticLinks');
//require('./postrender-plugins/sitemapGenerator');

// @ts-ignore
setPluginConfig(baseHrefRewrite, { href: `/${process.env.LOCALE}/` });

export const config: ScullyConfig = {
  projectRoot: "./src",
  defaultPostRenderers: [
    'seoHrefOptimise',
    //'sitemapGenerator',
    'fixStaticLinks',
    // @ts-ignore
    baseHrefRewrite,
    MinifyHtml,
  ],
  projectName: "openchia",
  outDir: `./dist/static/${process.env.LOCALE}`,
  distFolder: `./dist/openchia/${process.env.LOCALE}`,
  routes: {
  }
};