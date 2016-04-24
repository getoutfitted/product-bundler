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
      ancestors: ReactionRouter.getParam('_id')
    });
  }
});


Template.addProductsToBundle.onCreated(function () {
  this.subscribe('ProductsForBundles');
});

Template.addProductsToBundle.onRendered(function () {
  Session.setDefault('productSelected', false);
  Session.set('productSelected');
});

Template.addProductsToBundle.helpers({
  allTopProducts: function () {
    return ReactionCore.Collections.Products.find({
      shopId: ReactionCore.getShopId(),
      type: 'simple',
      ancestors: [],
      functionalType: { $ne: 'bundle'}
    }).fetch();
  },
  allVariantsForSelectedProduct: function () {
    let productId = Session.get('productToAddToBundle');
    return ReactionCore.Collections.Products.find({
      shopId: ReactionCore.getShopId(),
      type: 'variant',
      color: {$exists: true},
      size: {$exists: true},
      ancestors: productId,
      functionalType: { $ne: 'bundleVariant'}
    }).fetch();
  },
  productSelected: function () {
    return Session.get('productSelected');
  }
});

Template.addProductsToBundle.events({
  'change #selectProduct': function (event) {
    event.preventDefault();
    let productId = event.target.value;
    Session.set('productSelected', true);
    Session.set('productToAddToBundle', productId);
  },
  'submit #addProductToBundleForm': function (event) {
    event.preventDefault();
    let variantIds = [];
    let bundleVariantId = event.target.dataset.bundleId;
    let productId = event.target.selectedProduct.value;
    let label = event.target.itemLabel.value;
    _.each(event.target, function (target) {
      if (target.type === 'checkbox' && target.checked) {
        variantIds.push(target.value);
      }
    });
    if (variantIds.length > 0) {
      Meteor.call('productBundles/addProductToBundle',
                  bundleVariantId,
                  productId,
                  variantIds,
                  label
      );
      Alerts.removeSeen();
      Alerts.add('Successfully added product to Bundle.', 'success', {
                  autoHide: true});
    } else {
      Alerts.removeSeen();
      Alerts.add('You must check at least ONE variant!.', 'danger', {
                  autoHide: true});
    }
    Session.set('productSelected', false);
    Session.set('productToAddToBundle', undefined);
  }
});
