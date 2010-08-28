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

var editor = null;

$(document).ready(function() {
  $('#custom_preview').click(function(e) {
    $.get($(this).attr('action'), $('#custom_form').serialize(), null, "script");  
    return false;  
  });

  $('#script_preview').click(function(e) {
    $.get("/scripts/preview", $.param({code:editor.value}), null, "script");  
    return false;  
  });
  
  $('#script_save').click(function(e){
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) == null) {
      $('#script_code').val(editor.value);
    }
    $('#script_form').submit();
    return false;
  });
  
  if ($('#script_code').length > 0) {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) == null) {
      window.onBespinLoad = function() {
        bespin.useBespin("script_code").then(function(env) {
          editor = env.editor;

          editor.syntax = "js";
          env.settings.set("tabstop",2);
          env.settings.set("theme", "white");
        }, function(error) {
          throw new Error("Launch failed: " + error);
        });
      };
    }
  }
});
