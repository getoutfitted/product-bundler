Package.describe({
  summary: 'Product Bundles support for Reaction!',
  name: 'getoutfitted:product-bundles',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/product-bundles'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3.2');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');
  api.use('momentjs:moment@2.10.6');

  api.addFiles([
    'server/registry.js',
  ], 'server');
});
