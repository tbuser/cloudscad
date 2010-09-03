class Project < ActiveRecord::Base
  validates_presence_of :user_id, :name
  validates_uniqueness_of :name, :scope => :user_id
  validates_format_of :name, :with => /[a-z0-9_.-]+/i
  
  belongs_to :user
  
  after_create :create_repo
  
  def path
    "#{user.path}/#{name.downcase}.git"
  end
  
  def repo
    Grit::Repo.new(path)
  end
  
  private
  
  def create_repo
    # FileUtils.mkdir_p(path)
    r = Grit::Repo.init(path)
    # r.enable_daemon_serve
  end
end
