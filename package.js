Package.describe({
  summary: 'Product Bundles support for Reaction!',
  name: 'getoutfitted:product-bundler',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/product-bundles'
});

Npm.depends({
  'jquery': '2.2.3',
  'jquery-ui': '1.10.5',
  'bootstrap-datepicker': '1.6.0',
  'moment': '2.12.0',
  'moment-timezone': '0.5.3',
  'twix': '0.9.0'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use('meteor-platform');
  api.use('less');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');

  api.addFiles([
    'server/registry.js',
    'server/publications/products.js',
    'server/methods/productBundler.js',
    'server/hooks/before_copy_to_cart_hook.js'
  ], 'server');

  api.addFiles([
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js',
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js',
    'client/templates/bundleEdit/bundleEdit.html',
    'client/templates/bundleEdit/bundleEdit.js'
    // 'client/templates/datepicker/datepicker.html', // These files were pasted into datepicker.js
    // 'client/templates/datepicker/datepicker.js'
  ], 'client');
});
