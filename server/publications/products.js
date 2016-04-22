Meteor.publish('ProductsForBundles', function () {
  const shop = ReactionCore.getCurrentShop();
  if (Roles.userIsInRole(this.userId, ["admin", "createProduct"], shop._id)) {
    return ReactionCore.Collections.Products.find({});
  }
  return this.ready();
});

Meteor.publish('BundleProductAndVariants', function (orderId) {
  check(orderId, String);
  const shopId = ReactionCore.getShopId();
  if (Roles.userIsInRole(this.userId, ["admin", "createProduct"], ReactionCore.getShopId())) {
    return ReactionCore.Collections.Products.find({
      shopId: shopId,
      $or: [
        {_id: orderId},
        {ancestors: orderId}
      ]
    });
  }
  return this.ready();
});
