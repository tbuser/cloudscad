/* Author: Tony Buser

*/

jQuery.ajaxSetup({  
  'beforeSend': function (xhr) {xhr.setRequestHeader("Accept", "text/javascript")}  
});

jQuery.fn.submitWithAjax = function () {  
  this.submit(function () {  
    $.post($(this).attr('action'), $(this).serialize(), null, "script");  
    return false;  
  });  
};

$(document).ready(function() {
  $('#custom_preview').click(function() {
    $.get($(this).attr('action'), $('#custom_form').serialize(), null, "script");  
    return false;  
  });
});
