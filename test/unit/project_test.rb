require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  def setup
    @new_project = User.find(1).projects.build(:name => "New Project")
  end
  
  test "valid project" do
    assert @new_project.valid?
  end
  
  test "user id" do
    @new_project.user_id = ""
    assert !@new_project.valid?
    assert @new_project.errors[:user_id]
  end

  test "name" do
    @new_project.name = ""
    assert !@new_project.valid?
    assert @new_project.errors[:name]
  end
  
  test "unique name" do
    @new_project.name = "test cube"
    assert !@new_project.valid?
    assert @new_project.errors[:name]
  end
  
  test "name format" do
    @new_project.name = "foo!"
    assert !@new_project.valid?
    assert @new_project.errors[:name]
  end
  
  test "unchangable names" do
    project = Project.find(1)
    project.name = "foo"
    assert !project.valid?
    assert project.errors[:name]
  end
  
  test "user" do
    assert_kind_of User, @new_project.user
  end
  
  test "name reformatting" do    
    assert_equal "new_project", @new_project.name
    @new_project.name = "Foo Bar"
    assert_equal "foo_bar", @new_project.name
  end
  
  test "directory" do
    assert_equal File.join("tbuser", "new_project.git"), @new_project.directory
  end
  
  test "path" do
    assert_equal File.join(REPO_ROOT, "tbuser", "new_project.git"), @new_project.path
  end
  
  test "repo" do
    project = Project.find(1)
    assert_kind_of Grit::Repo, project.repo
  end
  
  test "url path" do
    assert_equal "/tbuser/new_project", @new_project.url_path, "home"
    assert_equal "/tbuser/new_project", @new_project.url_path("tree", "master"), "master home"
    assert_equal "/tbuser/new_project/tree/testing", @new_project.url_path("tree", "testing"), "branch home"
    assert_equal "/tbuser/new_project/tree/master/foo/bar", @new_project.url_path("tree", "master", ["foo","bar"]), "master sub directory"
    assert_equal "/tbuser/new_project/tree/testing/foo/bar", @new_project.url_path("tree", "testing", ["foo","bar"]), "branch sub directory"
    assert_equal "/tbuser/new_project/blob/master/test.scad", @new_project.url_path("blob", "master", ["test.scad"]), "blob view"
    assert_equal "/tbuser/new_project/download/master/test.scad", @new_project.url_path("download", "master", ["test.scad"]), "download"
  end
  
  test "updated blob attributes" do
    # flunk "TODO: should probably be moved to a blob model..."
  end
  
  test "repo creation and deletion" do
    path = @new_project.path

    @new_project.save
    assert File.exists?(path)
    assert File.exists?(File.join(path, '.git'))
    assert File.exists?(File.join(path, 'new_project.scad'))

    @new_project.destroy
    assert !File.exists?(path)
  end
end
