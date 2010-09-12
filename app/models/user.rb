class User < ActiveRecord::Base
  acts_as_authentic

  attr_accessible :username, :email, :password, :password_confirmation
  
  validates_uniqueness_of :username, :email
  validate :cannot_change_username, :on => :update
  
  has_many :scripts
  has_many :projects
  
  after_create :create_path
  
  def path
    File.join(REPO_ROOT, username)
  end
  
  def url_path
    "/#{username}"
  end
  
  private
  
  def cannot_change_username
    if username_changed?
      errors.add(:username, "cannot be changed")
    end
  end
  
  def create_path
    FileUtils.mkdir_p(path)
  end
end
