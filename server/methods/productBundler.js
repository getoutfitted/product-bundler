Meteor.methods({
  'productBundles/createBundleProduct': function (product, hashtags) {
    check(product, {
      title: String,
      pageTitle: String,
      description: String,
      handle: String,
      vendor: String,
      productType: String,
      price: {
        max: Number,
        min: Number,
        range: String
      }
    });
    check(hashtags, [String]);
    _.extend(product, {functionalType: 'bundle'});
    let productId = ReactionCore.Collections.Products.insert(product, {selector: {type: 'simple'}});
  }
});
