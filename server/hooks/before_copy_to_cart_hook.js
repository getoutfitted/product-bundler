ReactionCore.MethodHooks.before('cart/copyCartToOrder', function (options) {
  const cart = ReactionCore.Collections.Cart.findOne(options.arguments[0]);
  if (cart) {
    _.each(cart.items, function (item) {
      if (item.variants.functionalType === 'bundleVariant') {
        let quantityRange = _.range(1, item.quantity + 1);
        _.each(quantityRange, function (itemQty) {
          let chosen = _.find(item.variants.selectedBundleOptions, function (option) {
            return option.selectionForQtyNumber === itemQty;
          });
          let chosenVariants = _.where(item.variants.selectedBundleOptions, {selectionForQtyNumber: itemQty});
          _.each(chosenVariants, function (chosenOption) {
            // Meteor.call('cart/addToCart', chosenOption.productId, chosenOption.variantId);
            Meteor.call('productBundler/addBundleItemToCart',
                        chosenOption.productId,
                        chosenOption.variantId,
                        item.productId,
                        itemQty
            );
          });
        });
      }
    });
  }
  return options;
});
