Template.productBundlesDashboard.onCreated(function () {
  this.subscribe('ProductsForBundles');
  Session.setDefault('rentalPriceBundles', []);
});

Template.productBundlesDashboard.helpers({
  topProducts: function () {
    return ReactionCore.Collections.Products.find({
      type: 'simple'
    });
  },
  anyExistingBundles: function () {
    return ReactionCore.Collections.Products.find({
      functionalType: 'bundle',
      type: 'simple'
    }).count() > 0;
  },
  existingBundles: function () {
    return ReactionCore.Collections.Products.find({
      functionalType: 'bundle',
      type: 'simple'
    });
  }
});

Template.productBundlesDashboard.events({
  'submit #createBundle': function (event) {
    event.preventDefault();
    let product = {};
    product.title = event.target.bundleTitle.value;
    product.pageTitle = event.target.bundlePageTitle.value;
    product.description = event.target.bundleDescription.value;
    product.handle = event.target.bundleHandle.value;
    product.vendor = event.target.bundleVendor.value;
    product.productType = event.target.bundleProductType.value;
    product.price = {
      max: parseInt(event.target.bundlePrice.value, 10),
      min: parseInt(event.target.bundlePrice.value, 10),
    };
    product.price.range = product.price.min + '-' + product.price.max;
    let hashtags = event.target.bundleHashtags.value.split(',');
    Meteor.call('productBundles/createBundleProduct', product, hashtags);
  }
});
