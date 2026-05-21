'use strict';

hexo.extend.generator.register('fiction_redirect', function (locals) {
  const root = this.config.root || '/';

  const pages = locals.pages.toArray()
    .filter(page => {
      return page.path &&
        page.path.startsWith('fiction/') &&
        page.path.endsWith('.html') &&
        page.path !== 'fiction/index.html';
    })
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      if (dateA !== dateB) return dateB - dateA;

      return b.path.localeCompare(a.path, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

  if (!pages.length) {
    return {
      path: 'fiction/index.html',
      data: '<!doctype html><meta charset="utf-8"><p>No fiction pages found.</p>'
    };
  }

  const target = root.replace(/\/$/, '/') + pages[0].path;

  return {
    path: 'fiction/index.html',
    data: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    <script>
      location.replace(${JSON.stringify(target)});
    </script>
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to <a href="${target}">${pages[0].title || 'latest fiction'}</a>...</p>
  </body>
</html>`
  };
});