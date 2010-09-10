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
  
  def nice_project_path(project, content_type, treeish, path="")
    "/#{project.user.username}/#{project.name}/#{content_type}/#{treeish}/#{path}"
  end
  
end
