require 'test_helper'

class BlobsControllerTest < ActionController::TestCase
  setup :activate_authlogic
  
  test "openscad script compiling to stl download" do
    UserSession.create(users(:tony))
    post(:scad, {:username => "tbuser", :projectname => "test_cube", :content_type => "scad", :treeish => "master", :path => "test_cube.scad", :format => "stl", :size => 20})
    
    assert_equal File.read("test/fixtures/test_cube.stl"), @response.body
  end
end
