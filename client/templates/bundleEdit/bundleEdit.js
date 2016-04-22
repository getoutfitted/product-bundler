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


