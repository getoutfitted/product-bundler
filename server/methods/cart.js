function verifyCorrectProduct(variantOptions, selectedVariantId) {
  let result = false;
  _.each(variantOptions, function (variantOption) {
    if (variantOption.variantId === selectedVariantId) {
      result = true;
    }
  });
  return result;
}

Meteor.methods({
  'productBundler/updateCartItems': function (productId, variantId, selectedVariants) {
    check(productId, String);
    check(variantId, String);
    check(selectedVariants, [String]);
    // let cart = ReactionCore.Collections.Cart.findOne(cartId);
    // // console.log('cart', cart)
    // let items = cart.items;
    // let thisBundleItem = _.find(items, function (item) {
    //   // const bundleType = item.variants.functionalType === 'bundleVariant';
    //   const noSelections = item.variants.selectedBundleOptions.length <= 0;
    //   const correctProductId  = item.productId === productId;
    //   const correctVariantId = item.variants._id === variantId;
    //   if (noSelections && correctProductId && correctVariantId) {
    //     return item;
    //   }
    // });
    // let selectedBundleOptions = [];
    // _.each(thisBundleItem.bundleProducts, function (bundleProduct) {
    //   let options = {
    //     productId: bundleProduct.productId
    //   }

    // })

    // let bundleItem = _.findWhere(cart.items, {
    //   'productId': productId,
    //   'variants._id': variantId
    //   // 'variants.selectedBundleOption': []
    // });
    // console.log('bundle', bundleItem);
    // let selectedOptions = [];
    // let bundleItem = _.find(cart.items, function(item) {
    //   item.functionalType
    // })
    // _.each(cart.items.productBundles, function (productBundle, index) {
    //   let selectedInfo = {};
    //   selectedInfo.productId = productBundle.productId;
    //   if (verifyCorrectProduct(productBundle.variantIds, selectedVariants[index])) {
    //     selectedInfo.variantId = selectedVariants[index];

    //   }
    // });
    // let modifiedSelectedVariants = [];
    // _.each(selectedVariants, function (v) {
    //   let t = {};
    //   t.variandId = v;
    //   modifiedSelectedVariants.push(t);
    // });
    // let t  = [{
    //   variantId: selectedVariants[0]
    // },
    // {
    //   variantId: selectedVariants[1]
    // }]
    // ReactionCore.Collections.Cart.update({
    //   '_id': cartId,
    //   'items.productId': productId,
    //   'items.variants._id': variantId,
    //   'items.vartiants.selectedBundleOptions': {
    //     $exists: false
    //   }
    // }, {
    //   $set: {
    //     'items.$.variants.selectedBundleOptions': t
    //   }
    // });
  }
});
