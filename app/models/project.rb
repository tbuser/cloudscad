class Project < ActiveRecord::Base
  validates_presence_of :user_id, :name
  validates_uniqueness_of :name, :scope => :user_id
  validates_format_of :name, :with => /[a-z0-9_.-]+/i
  
  belongs_to :user
  
  after_create :create_repo
  
  def path
    File.join(REPO_ROOT, directory)
  end
  
  def directory
    File.join(user.username, "#{name.downcase}.git")
  end
  
  def repo
    Grit::Repo.new(path)
  end
  
  private
  
  def create_repo
    FileUtils.mkdir_p(path)
    FileUtils.cp_r(DOT_GIT_PATH, File.join(path, ".git"))
    File.open("#{name}.scad", 'w') { |f| f.write('cube([10,10,10], center=true);') }
    repo.add("#{name}.scad")
    repo.commit_index("new project")
  end
end
