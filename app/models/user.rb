class User < ActiveRecord::Base
  acts_as_authentic

  attr_accessible :username, :email, :password, :password_confirmation
  
  has_many :scripts
  has_many :projects
  
  after_create :create_path
  
  def path
    "#{REPO_ROOT}/#{username[0]}/#{username}"
  end
  
  private
  
  def create_path
    FileUtils.mkdir_p(path)
  end
end
