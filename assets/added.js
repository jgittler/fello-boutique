function sleep(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

$(".quick-view").on("click", function() {
  sleep(500).then(function() {
    $("#quick-view-modal").find("#size-link").remove();
    $("#quick-view-modal").find(".price").css("padding-bottom", "20px");
    $(".product-single__thumbnail").removeClass("hidden");
  });
});
