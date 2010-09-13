module ProjectsHelper
  def content_type_name(content)
    content.class.to_s.gsub("Grit::", "").downcase
  end
end
