module ProjectsHelper
  
  def content_type_name(content)
    content.class.to_s.gsub("Grit::", "").downcase
  end
  
  def repo_icon(content)
    png = case content.class.to_s
    when "Grit::Blob"
      "page_white_text.png"
    when "Grit::Tree"
      "folder.png"
    else
      "exclamation.png"
    end
    
    image_tag(png)
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
end
