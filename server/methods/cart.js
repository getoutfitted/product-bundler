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
    const { Log } = ReactionCore;
    const cart = ReactionCore.Collections.Cart.findOne({ userId: this.userId });
    if (!cart) {
      Log.error(`Cart not found for user: ${ this.userId }`);
      throw new Meteor.Error(404, "Cart not found",
        "Cart not found for user with such id");
    }

    let items = cart.items;
    let thisBundleItem = _.find(items, function (item) {
      const correctProductId  = item.productId === productId;
      const correctVariantId = item.variants._id === variantId;
      const isBundle = item.variants.functionalType === 'bundleVariant';
      if (correctProductId && correctVariantId && isBundle) {
        return item;
      }
    });
    const itemNumber = thisBundleItem.quantity;
    const numberOfBundleOptions = thisBundleItem.variants.bundleProducts.length;
    if (numberOfBundleOptions !== selectedVariants.length) {
      Log.error(`Not all options were selected for item ${thisBundleItem._id} in Cart ${cart._id} `)
    }

    let selectedOptions = thisBundleItem.variants.selectedBundleOptions || [];
    _.each(thisBundleItem.variants.bundleProducts, function (bundleProduct) {
      let bundleSelection = {
        selectionForQtyNumber: itemNumber,
        productId: bundleProduct.productId
      };
      let selectedVariant = _.find(bundleProduct.variantIds, function (option) {
        return _.contains(selectedVariants, option.variantId);
      });
      bundleSelection.variantId = selectedVariant.variantId;
      if (bundleProduct.label && selectedVariant.label) {
        bundleSelection.cartLabel = `${bundleProduct.label} ${selectedVariant.label}`;
      } else if (bundleProduct.label) {
        bundleSelection.cartLabel = `${bundleProduct.label}`;
      } else if (selectedVariant.label) {
        bundleSelection.cartLabel = `${selectedVariant.label}`;
      } else {
        let label = ReactionCore.Collections.Products.findOne(selectedVariant.variantId);
        return label.vendor + label.title;
      }
      selectedOptions.push(bundleSelection);
    });

    ReactionCore.Collections.Cart.update({
      '_id': cart._id,
      'items.productId': productId,
      'items.variants._id': variantId
    }, {
      $set: {
        'items.$.variants.selectedBundleOptions': selectedOptions
      }
    });
  },
  'productBundler/addBundleItemToCart': function (productId, variantId, bundleId, bundleIndex) {
    check(productId, String);
    check(variantId, String);
    check(bundleId, String)
    check(bundleIndex, Number);
    const { Log } = ReactionCore;
    const cart = ReactionCore.Collections.Cart.findOne({ userId: this.userId });
    if (!cart) {
      Log.error(`Cart not found for user: ${ this.userId }`);
      throw new Meteor.Error(404, "Cart not found",
        "Cart not found for user with such id");
    }
    let product;
    let variant;
    ReactionCore.Collections.Products.find({ _id: { $in: [
      productId,
      variantId
    ]}}).forEach(doc => {
      if (doc.type === "simple") {
        product = doc;
      } else {
        variant = doc;
      }
    });
    if (!product) {
      Log.warn(`Product: ${ productId } was not found in database`);
      throw new Meteor.Error(404, "Product not found",
        "Product with such id was not found!");
    }
    if (!variant) {
      Log.warn(`Product variant: ${ variantId } was not found in database`);
      throw new Meteor.Error(404, "ProductVariant not found",
        "ProductVariant with such id was not found!");
    }
    let quantity = 1;

    return ReactionCore.Collections.Cart.update({
      _id: cart._id
    }, {
      $addToSet: {
        items: {
          _id: Random.id(),
          shopId: product.shopId,
          productId: productId,
          quantity: quantity,
          variants: variant,
          type: product.type,
          customerViewType: 'bundleComponent',
          bundleProductId: bundleId,
          bundleIndex: bundleIndex
        }
      }
    }, function (error, result) {
      if (error) {
        Log.warn("error adding to cart", ReactionCore.Collections.Cart
          .simpleSchema().namedContext().invalidKeys());
        return error;
      }

      // refresh shipping quotes
      // Meteor.call("shipping/updateShipmentQuotes", cart._id);

      Log.info(`Cart Bundle: added Selected variant ${variantId} to cartId ${cart._id}`);

      return result;
    });
  }
});
