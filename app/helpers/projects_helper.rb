module ProjectsHelper
  
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
  
end
