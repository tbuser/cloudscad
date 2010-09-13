class Project < ActiveRecord::Base
  validates_presence_of :user_id, :name
  validates_uniqueness_of :name, :scope => :user_id, :case_sensitive => false
  validates_format_of :name, :with => /\A([a-z0-9_.-]+)\Z/i
  
  belongs_to :user
  
  after_create :create_repo
  
  def name=(str)
    self[:name] = str.to_s.downcase.gsub(" ", "_")
  end

  def path
    File.join(REPO_ROOT, directory)
  end
  
  def directory
    File.join(user.username, "#{name.downcase}.git")
  end
  
  def repo
    Grit::Repo.new(path)
  end
  
  def url_path(content_type="", treeish="", path="")
    path = File.join(path) if path.is_a?(Array)
    
    unless path == ""
      content_type = "tree" if content_type == ""
      treeish = "master" if treeish == ""
    end
    
    if content_type == "tree" and treeish == "master" and path == ""
      content_type = ""
      treeish = ""
    end
    
    "/#{user.username}/#{name}/#{content_type}/#{treeish}/#{path}".gsub(/\/+/, '/')
  end
  
  def update_blob_attributes(params)
    
  end
  
  private
  
  def create_repo
    FileUtils.mkdir_p(path)
    # FileUtils.cp_r(DOT_GIT_PATH, File.join(path, ".git"))

    Dir.chdir(path) do
      r = `git init .`
      raise "Failed to initialize project: #{r}" unless r.include?("Initialized empty Git repository in #{path}/.git/")
      File.open("#{name.downcase}.scad", 'w') { |f| f.write('cube([10,10,10], center=true);') }
      repo.add("#{name.downcase}.scad")
      raise "Failed to add project script" unless repo.commit_all("new project")
    end
  end
end
