require('dotenv').config();

module.exports = function (eleventyConfig) {
  // Pass through static assets from project root (not processed by Eleventy)
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');

  // Admin is a standalone SPA — pass through without template processing
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });

  // Prevent Eleventy from treating admin files as templates
  eleventyConfig.ignores.add('src/admin/**');

  // ── Filters ──────────────────────────────────────────────────────────────

  eleventyConfig.addFilter('json', (v) => JSON.stringify(v));

  // Safe HTML output (Nunjucks autoescapes by default)
  eleventyConfig.addFilter('safe', (v) => v);

  eleventyConfig.addFilter('forSale', (props) =>
    (props || []).filter((p) => p.status === 'for_sale')
  );

  eleventyConfig.addFilter('sold', (props) =>
    (props || []).filter((p) => p.status === 'sold')
  );

  eleventyConfig.addFilter('featured', (props) =>
    (props || []).find((p) => p.is_featured) || (props || [])[0] || null
  );

  eleventyConfig.addFilter('excludeSlug', (props, slug) =>
    (props || []).filter((p) => p.slug !== slug).slice(0, 3)
  );

  eleventyConfig.addFilter('activeTestimonial', (list) =>
    (list || []).find((t) => t.is_active) || (list || [])[0] || null
  );

  eleventyConfig.addFilter('getStat', (stats, key) =>
    (stats || []).find((s) => s.key === key) || null
  );

  eleventyConfig.addFilter('getSetting', (settings, key) => {
    const item = (settings || []).find((s) => s.key === key);
    return item ? item.value : '';
  });

  eleventyConfig.addFilter('getPage', (pages, key) =>
    (pages || []).find((p) => p.page_key === key) || null
  );

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    templateFormats: ['njk', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
