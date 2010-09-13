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
    info.innerHTML = "Loading STL..."
    $.get($(this).attr('action'), $('#custom_form').serialize(), null, "script");  
    return false;  
  });

  $('#blob_preview').click(function(e) {
    info.innerHTML = "Loading STL..."
    $.get("/projects/preview", $.param({code:editor.value}), null, "script");  
    return false;  
  });
  
  $('#blob_save').click(function(e){
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) == null) {
      $('#blob_data').val(editor.value);
    }
    $('#blob_form').submit();
    return false;
  });
  
  if ($('#blob_data').length > 0) {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) == null) {
      window.onBespinLoad = function() {
        bespin.useBespin("blob_data").then(function(env) {
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

function load_stl_string(stl_string) {
  
}