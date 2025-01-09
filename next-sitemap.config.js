module.exports = {
  siteUrl: 'https://knots.techmorphers.com',
  generateRobotsTxt: true,
  exclude: [],
  sitemapSize: 7000,
  transform: async (config, path) => {
    console.log('Including in sitemap:', path);
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
