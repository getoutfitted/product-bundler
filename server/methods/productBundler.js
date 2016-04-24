Meteor.methods({
  'productBundles/createBundleVariant': function (productId, product) {
    check(productId, String);
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
    let variant = _.clone(product);
    variant.ancestors = [productId];
    variant.price = product.price.max;
    variant.functionalType = 'bundleVariant';
    variant.type = 'variant';
    variant.shopId = ReactionCore.getShopId();
    let variantId = ReactionCore.Collections.Products.insert(variant, {selector: {type: 'variant'}});
    ReactionCore.Log.info('Bundle Variant ' + variantId + ' was successfully created.');
  },
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
    let insertProduct = _.clone(product);
    insertProduct.functionalType = 'bundle';
    insertProduct.shopId = ReactionCore.getShopId();
    let productId = ReactionCore.Collections.Products.insert(insertProduct, {selector: {type: 'simple'}});
    if (productId) {
      _.each(hashtags, function (hashtag) {
        Meteor.call('products/updateProductTags', productId, hashtag.trim(), null);
      });
      ReactionCore.Log.info('Bundle Product ' + productId + ' was successfully created.');
      Meteor.call('productBundles/createBundleVariant', productId, product);
    }
  },
  'productBundles/addProductToBundle': function (bundleVariantId, productId, variantIds, label) {
    check(bundleVariantId, String);
    check(productId, String);
    check(variantIds, [String]);
    check(label, Match.Optional(String));

  }
});
