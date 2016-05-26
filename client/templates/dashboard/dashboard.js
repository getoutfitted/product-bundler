Template.productBundlesDashboard.onCreated(function () {
  this.subscribe('ProductsForBundles');
  Session.setDefault('bundlePriceBuckets', []);
});

Template.productBundlesDashboard.helpers({
  topProducts: function () {
    return ReactionCore.Collections.Products.find({
      type: 'simple'
    });
  },
  anyExistingBundles: function () {
    return ReactionCore.Collections.Products.find({
      functionalType: 'bundle',
      type: 'simple'
    }).count() > 0;
  },
  existingBundles: function () {
    return ReactionCore.Collections.Products.find({
      functionalType: 'bundle',
      type: 'simple'
    });
  },
  anyPriceBuckets: function () {
    return Session.get('bundlePriceBuckets').length > 0;
  },
  bundlePriceBuckets: function () {
    return Session.get('bundlePriceBuckets');
  }
});

Template.productBundlesDashboard.events({
  'submit #createBundle': function (event) {
    event.preventDefault();
    let product = {};
    product.title = event.target.bundleTitle.value;
    product.pageTitle = event.target.bundlePageTitle.value;
    product.description = event.target.bundleDescription.value;
    product.handle = event.target.bundleHandle.value;
    product.vendor = event.target.bundleVendor.value;
    product.productType = event.target.bundleProductType.value;
    product.price = {
      max: parseInt(event.target.bundlePrice.value, 10),
      min: parseInt(event.target.bundlePrice.value, 10)
    };
    product.price.range = product.price.min + '-' + product.price.max;
    let hashtags = event.target.bundleHashtags.value.split(',');
    Meteor.call('productBundles/createBundleProduct', product, hashtags);
  },
  'click .addBundlePriceBucket': function (event) {
    event.preventDefault();
    let priceBucket = {};
    priceBucket.timeUnit = $('[name=timeUnit]').val();
    priceBucket.duration = parseInt($('[name=duration]').val(), 10);
    priceBucket.price = parseFloat($('[name=bucketPrice]').val(), 10);
    let currentBuckets = Session.get('bundlePriceBuckets');
    let bucketExists = _.some(currentBuckets, function (bucket) {
      return bucket.duration === priceBucket.duration;
    });
    if (bucketExists) {
      Alerts.removeSeen();
      Alerts.add(`Price Bucket with a duration of ${priceBucket.duration} already exists.`, 'danger', {
        autoHide: true});
    } else {
      currentBuckets.push(priceBucket);
      Session.set('bundlePriceBuckets', currentBuckets);
    }
    $('[name=bucketPrice]').val('0.00');
  },
  'click .removePriceBucket': function () {
    event.preventDefault();
    const duration = parseInt(event.target.dataset.duration, 10);
    let currentBuckets = Session.get('bundlePriceBuckets');
    let updatedBuckets = _.reject(currentBuckets, function (bucket) {
      return bucket.duration === duration;
    });
    Session.set('bundlePriceBuckets', updatedBuckets);
  }
});
