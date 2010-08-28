# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def avatar_image_tag(email, gravatar_options={}, html_options={})
    url = "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(email)}?_="
    
    gravatar_options.each do |k,v|
      url << "&#{k}=#{v}"
    end
    
    image_tag(url, html_options)
  end  
end
