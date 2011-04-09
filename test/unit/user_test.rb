require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @new_user = User.new(:email => "foo@bar.com", :username => "foo", :password => "abc123", :password_confirmation => "abc123")
  end
  
  test "valid user" do
    assert @new_user.valid?
  end

  test "username" do
    @new_user.username = ""
    assert !@new_user.valid?
    assert @new_user.errors[:username]
  end

  test "password" do
    @new_user.password = ""
    @new_user.password_confirmation = ""
    assert !@new_user.valid?
    assert @new_user.errors[:password]
  end

  test "password confirmation" do
    @new_user.password_confirmation = ""
    assert !@new_user.valid?
    assert @new_user.errors[:password]
  end
  
  test "email format" do
    @new_user.email = "foobarbaz"
    assert !@new_user.valid?
    assert @new_user.errors[:email]
  end

  test "email length" do
    @new_user.email = "foo"
    assert !@new_user.valid?
    assert @new_user.errors[:email]
  end
  
  test "unique username" do
    @new_user.username = "tbuser"
    assert !@new_user.valid?
    assert @new_user.errors[:username]
  end
  
  test "unique email" do
    @new_user.username = "tbuser@gmail.com"
    assert !@new_user.valid?
    assert @new_user.errors[:email]
  end
  
  test "path" do
    assert_equal @new_user.path, File.join(REPO_ROOT, "foo")
  end
  
  test "url" do
    assert_equal @new_user.url_path, "/#{@new_user.username}"
  end

  test "unchangable usernames" do
    user = User.find(1)
    user.username = "foo"
    assert !user.save
    assert user.errors[:username]
  end
  
  test "path creation" do
    @new_user.save
    assert File.exists?(@new_user.path)
    FileUtils.rm_r(@new_user.path)
  end
  
  test "has projects" do
    user = User.find(1)
    assert user.projects.size > 0
    assert_kind_of Project, user.projects[0]
  end
end
