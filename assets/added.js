function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

$(".quick-view").on("click", function() {
  sleep(500).then(() => {
    var btn = $("#quick-view-modal").find(".btn-modal").remove();
    var target = $("#quick-view-modal").find(".modal").remove();
  });
});

//   $(".quick-view").on("click", function() {
//     sleep(1500).then(() => {
//       var btn = $("#quick-view-modal").find(".btn-modal");
//       var target = $("#quick-view-modal").find(".modal");
//       var uid = Math.round(Math.random() * 100000.0).toString();
//       btn.attr("data-target", "." + uid);
//       target.addClass(uid);
//       addEscape();
//   	});
//   });