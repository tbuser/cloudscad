module BlobsHelper
  def format_code(code)
    CodeRay.scan(code, :c).div(:line_numbers => :inline)
  end
  
  def blob_display(blob)
    case blob.mime_type 
    when "application/sla"
      "stl"
    when "text/plain"
      raw(format_code(blob.data))
    else
      "Binary Data"
    end    
  end
  
  def thingiview_init(extra_code="")
    content_for(:head) do
      javascript_tag("
        window.onload = function() {
          thingiurlbase = '/javascripts/thingiview/';
          thingiview = new Thingiview('viewer');
          thingiview.setObjectColor('#C0D8F0');
          thingiview.initScene();
          #{extra_code}
        }
      ")
    end
  end
end