// Constants

const VIEW_HOLDER_SELECTOR = '#viewer .view-holder';
const ACTIVE_VARIATION_SELECTOR = '#viewer .view-holder.active img';
const TRANSITION_MS = 1000;
const INCREMENTERS = { 'first' : incrementDown, 'last' : incrementUp };
const PRODUCT_VIEWS_SELECTORS = '#views li[data-original-title="Front View"], #views li[data-original-title="Side View"], #views li[title="Front View"], #views li[title="Side View"]';
const GALLERY_SELECTORS = '#views li[data-original-title="Gallery"], #views li[title="Gallery"]';
const SIZE_GUIDE_SELECTORS = '#views li[data-original-title="Size Guide"], #views li[title="Size Guide"]';

// Functions

function showView($target) {
  $target.show();
  $target.addClass('active');
  $target.animate({ opacity: 1 }, TRANSITION_MS);
}

function hideView($target) {
  $target.hide();
  $target.removeClass('active');
  $target.css('opacity', 0);
}

function transition(cssSelector, activator, transitionTo, transitionFrom) {
  var $newView = setTarget(cssSelector, activator, 'activate');
  var $otherViews = $(cssSelector).not($newView);
  transitionTo($newView);
  transitionFrom($otherViews);
}

function setTarget(wrapper, activator, dataType) {
  return $(wrapper + '[data-target="' + $(activator).data(dataType) + '"]');
}

function setActive(activated) {
  var $activated = $(activated);
  $activated.siblings().removeClass('active');
  $activated.addClass('active', TRANSITION_MS, 'easeOutBounce');
}

function transitionView(cssSelector, activatorHolder) {
  var $activator = $(activatorHolder).find('a');
  transition(cssSelector, $activator, showView, hideView)
  setActive(activatorHolder);
  setCBLink($activator);
}

function setCBLink($activator) {
  var cbData = Object.keys($activator.data()).indexOf('cb');
  if (cbData > -1) {
    var $cbLink = $('#toggler > a');
    $cbLink.attr('href', 'http://' + $activator.data('cb') + '.felloeyewe.pay.clickbank.net');
    $cbLink.children().html('purchase &middot; ' + $activator.data('price'));
  }
}

function insertImg(img) {
  $poster = $('#gallery img');
  $poster.attr('src', $(img).attr('src'));
  $poster.attr('data-target', $(img).data('activate'));
  $poster.data('target', $(img).data('activate'));
}

function activeGallery() {
  return $('#gallery').hasClass('active');
}

function activePoster() {
  return $('#gallery img').attr('src').length > 0;
}

function newContext(context) {
  var $activator = $(ACTIVE_VARIATION_SELECTOR + '.active');
  transitionView(VIEW_HOLDER_SELECTOR, context)
  var $target = setTarget(ACTIVE_VARIATION_SELECTOR, $activator, 'target');
  showView($target);
  hideView($target.siblings($target.length ? $target[0].tagName : $target));
}

function galleryEndImg(limitType) {
  return $('#gallery-holder img:' + limitType + '-of-type');
}

function incrementDown(num) { return num - 1; }

function incrementUp(num) { return num + 1; }

function galleryIds() {
  return $('#gallery-holder img').map(function() { return $(this).data('activate'); }).get();
}

function increment(nums, currentNum, incrementer) {
  return nums[incrementer(nums.indexOf(currentNum))];
}

function nextImg(direction, currentPosition) {
  var newId = increment(galleryIds(), currentPosition, INCREMENTERS[direction]);
  var newImg = $('#gallery-holder img[data-activate="'+ newId + '"]');
  insertImg(newImg);
}

function showSide(side) { insertImg(galleryEndImg(side)); }

function toggleEnts(ents) {
  $.each(ents, function(attr, els) {
    $.each(els, function(el, state) {
      $(el).css(attr, state);
    });
  });
}

// Event Listeners

$('#views li').on('click', function() {
  if ($(this).data('original-title') != 'Gallery') {
    toggleEnts({ 'display' : { '#toggler' : 'block' } });
  }
  newContext(this);
});

$('#toggler li, .variation-circle').on('click', function() {
  transitionView(ACTIVE_VARIATION_SELECTOR, this);
  var nextCbId = $(this).children('a.round').data('cb');
  setActive($('#toggler ul a[data-cb="' + nextCbId + '"]').parent('li'));
});

$(PRODUCT_VIEWS_SELECTORS).on('click', function() {
  toggleEnts({
    'display' : { '#gallery-holder' : 'block', '#toggler' : 'block' },
    // 'height' : { '#viewer-container' : '540px', '#viewer' : 'auto' }
    'height' : { '#viewer' : 'auto' }
  });
  $('#cb-quick-buy li').removeClass('unclickable');
});

$(GALLERY_SELECTORS).on('click', function() {
  toggleEnts({
    'display' : { '#toggler' : 'none', '#gallery-holder' : 'block' },
    'height' : { '#viewer-container' : '720px', '#viewer' : '100%' }
  });
  if (!activePoster()) { showSide('first'); }
  $('#cb-quick-buy li').addClass('unclickable');
});

$(SIZE_GUIDE_SELECTORS).on('click', function() {
  toggleEnts({
    'display' : { '#toggler' : 'none', '#gallery-holder' : 'none' },
    'height' : { '#viewer-container' : 'auto', '#viewer' : '100%' }
  });
  $('#cb-quick-buy li').addClass('unclickable');
});

$('#gallery-holder img').on('click', function() {
  toggleEnts({
    'display' : { '#toggler' : 'none', '#gallery-holder' : 'block' },
    'height' : { '#viewer-container' : '720px', '#viewer' : '100%' }
  });
  insertImg(this);
  if (!activeGallery()) { newContext($('#views li[data-original-title="Gallery"]')); }
});

$(document).ready(function() {
  $('[data-toggle="popover"]').popover({
    'trigger' : 'hover',
    'template' : '<div class="popover sharp fade right in" role="tooltip" style="top: 156.5px; left: 50px; display: block;"><div class="arrow" style="top: 50%;"></div><h3 class="popover-title">Size Guide</h3></div>'
  });
});

$('#gallery span').on('click', function() {
  var currentId = $('#gallery img').data('target');
  var moveTowards = $(this).data('move-towards');
  var onFirst = currentId == galleryEndImg('first').data('activate');
  var moveTowardsFirst = moveTowards == 'first';
  var onLast = currentId == galleryEndImg('last').data('activate');
  var moveTowardsLast = moveTowards == 'last';
  if (onFirst && moveTowardsFirst) {
    showSide('last');
  } else if (onLast && moveTowardsLast) {
    showSide('first');
  } else {
    nextImg(moveTowards, currentId);
  }
});
