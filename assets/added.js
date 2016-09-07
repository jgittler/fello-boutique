function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

$(".quick-view").on("click", function() {
  sleep(500).then(() => {
    $("#quick-view-modal").find("#size-link").remove();
    $("#quick-view-modal").find(".price").css("padding-bottom", "20px");
    $(".product-single__thumbnail").removeClass("hidden");
  });
});