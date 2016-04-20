Meteor.publish('ProductsForBundles', function () {
  const shop = ReactionCore.getCurrentShop();
  if (Roles.userIsInRole(this.userId, ["admin", "createProduct"], shop._id)) {
    return ReactionCore.Collections.Products.find({});
  }
  return this.ready();
});
