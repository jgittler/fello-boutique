$(".checkout-field").on('focus', function() {
  $(this).attr('placeholder', '');
});

// Bind to the submit event of our form
$("#email-catcher").submit(function(event){
  // Prevent default posting of form
  event.preventDefault();

  var pbtmlstr = '<div id="purchase-progress" class="sharp progress"><div id="pb-tco" class="active progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" style="width: 35%;"><span class="sr-only"></span></div></div>'
  $("hr.highlight").replaceWith(pbtmlstr);

  var $form = $(this);

  // set device type
  var device = "Desktop";
  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    device = "Mobile";
  }

  // Let's select and cache all the fields
  var $inputs = $form.find("input");
  var email = $form.find("input[type='email']").val();
  var item = $form.find("#new-pid").val();
  var endpoint = "https://lit-waters-15292.herokuapp.com/create";
  var urlWithData = endpoint + "?email=" + email + "&device=" + device + "&item=" + item;

  // Let's disable the inputs for the duration of the Ajax request.
  $inputs.prop("disabled", true);

  // Fire off the request to endpoint
  request = $.ajax({
    url: urlWithData,
    type: "post"
  });

  // Callback handler that will be called regardless
  request.always(function () {
    $("#pb-tco").animate({width: "100%"}, 750);
    $inputs.prop("disabled", false);
    $("#purchase-progress").replaceWith('<hr class="highlight" />');
    window.location = "/checkout?checkout[email]=" + email;
  });
});
