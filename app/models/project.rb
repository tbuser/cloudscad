class Project < ActiveRecord::Base
  attr_accessible :name, :description
  
  validates_presence_of :user_id, :name
  validates_uniqueness_of :name, :scope => :user_id, :case_sensitive => false
  validates_format_of :name, :with => /\A([a-z0-9_.-]+)\Z/i
  validate :cannot_change_name, :on => :update
  
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
  
  # TODO: move to a seperate blob model...
  def update_blob_attributes(params)
    Dir.chdir(path) do
      current_name = params[:path].split("/")[-1]
    
      if current_name != params[:name]
        old_path = params[:path]
        params[:path] = params[:path].split("/")[0..-2].join("/") + params[:name]
        # TODO: needs error checking?
        repo.git.mv({}, old_path, params[:path])
      end

      File.open(File.join(path,params[:path]), 'w') do |f|
        f.write(params[:data])
      end
    
      if repo.commit_all(params[:message]) == ""
        errors.add_to_base("Failed To Commit Changes")
        return false
      end
    end
  end
  
  private
  
  def cannot_change_name
    if name_changed?
      errors.add(:name, "cannot be changed")
    end
  end
  
  def create_repo
    FileUtils.mkdir_p(path)

    Dir.chdir(path) do
      r = `git init .`
      # r = repo.git.init({}, ".")
      raise "Failed to initialize project: #{r}" unless r.include?("Initialized empty Git repository in #{path}/.git/")
      File.open("#{name.downcase}.scad", 'w') do |f|
        f.write("// Size of cube\nsize = 20;\n\ntranslate([0, 0, size/2]) cube([size,size,size], center=true);")
      end
      repo.add("#{name.downcase}.scad")
      raise "Failed to add project script" unless repo.commit_all("new project")
    end
  end  
  
end
