ReactionCore.registerPackage({
  label: 'GetOutfitted Product Bundles',
  name: 'product-bundles',
  icon: 'fa fa-medkit',
  autoEnable: false,
  registry: [{
    route: '/dashboard/product-bundles',
    provides: 'dashboard',
    name: 'productBundles',
    label: 'Getoutfitted Product Bundles ',
    description: 'Create bundled products',
    container: 'getoutfitted',
    icon: 'fa fa-medkit',
    template: 'productBundlesDashboard',
    workflow: 'coreWorkflow',
    priority: 3
  }, {
    route: '/dashboard/productBundles/settings',
    provides: 'settings',
    label: 'GetOutfitted Product Bundles Settings',
    name: 'productBundlesSettings',
    template: 'productBundlesSettings'
  }]
});
