Meteor.publish('ProductsForBundles', function () {
  const shop = ReactionCore.getCurrentShop();
  if (Roles.userIsInRole(this.userId, ['admin', 'createProduct'], shop._id)) {
    return ReactionCore.Collections.Products.find({});
  }
  return this.ready();
});

Meteor.publish('BundleProductAndVariants', function (orderId) {
  check(orderId, String);
  const shopId = ReactionCore.getShopId();
  if (Roles.userIsInRole(this.userId, ['admin', 'createProduct'], ReactionCore.getShopId())) {
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

Meteor.publish('bundleReservationStatus', function (productIds) {
  check(productIds, [String]);
  if (!productIds) {
    ReactionCore.Log.info('ignoring null request on productReservationStatus subscription');
    return this.ready();
  }
  return ReactionCore.Collections.InventoryVariants.find({
    productId: {
      $in: productIds
    },
    active: true,
    'workflow.status': 'active'
  }, {
    fields: {productId: 1, unavailableDates: 1, numberOfDatesBooked: 1, 'workflow.status': 1},
    sort: {unavailableDates: -1}
  });
});


