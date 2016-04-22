Template.productBundleEdit.onCreated(function () {
  this.autorun(() => {
    let orderId = ReactionRouter.getParam('_id');
    this.subscribe('BundleProductAndVariants', orderId);
  });
});

Template.productBundleEdit.helpers({
  thisProduct: function () {
    return ReactionCore.Collections.Products.findOne({
      shopId: ReactionCore.getShopId(),
      _id: ReactionRouter.getParam('_id')
    });
  }
});


Template.addProductsToBundle.onCreated(function () {
  this.subscribe('ProductsForBundles');
});

Template.addProductsToBundle.helpers({
  allTopProducts: function () {
    return ReactionCore.Collections.Products.find({
      shopId: ReactionCore.getShopId(),
      type: 'simple',
      ancestors: [],
      funtionalType: { $ne: 'bundle'}
    });
  }
});
