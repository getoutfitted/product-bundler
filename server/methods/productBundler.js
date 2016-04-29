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
    variant.inventoryManagement = false;
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
    check(variantIds, [Object]);
    check(label, Match.Optional(String));
    let product = {
      productId: productId,
      variantIds: variantIds
    };
    if (label) {
      product.label = label;
    }
    ReactionCore.Collections.Products.update({
      _id: bundleVariantId
    }, {
      $addToSet: {
        bundleProducts: product
      }
    }, {
      selector: {
        type: 'variant'
      }
    });
  },
  'productBundles/deleteProduct': function (bundleVariantId, productId) {
    check(bundleVariantId, String);
    check(productId, String);
    ReactionCore.Collections.Products.update({
      _id: bundleVariantId
    }, {
      $pull: {
        bundleProducts: {
          productId: productId
        }
      }
    }, {
      selector: {
        type: 'variant'
      }
    });
  }
});
