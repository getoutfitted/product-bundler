ReactionCore.MethodHooks.before('cart/copyCartToOrder', function (options) {
  const cart = ReactionCore.Collections.Cart.findOne(options.arguments[0]);
  console.log('cart', cart)
  return options;
});
