require 'test_helper'

class ScriptsControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end
  
  def test_new
    get :new
    assert_template 'new'
  end
  
  def test_create_invalid
    Script.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end
  
  def test_create_valid
    Script.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to scripts_url
  end
  
  def test_edit
    get :edit, :id => Script.first
    assert_template 'edit'
  end
  
  def test_update_invalid
    Script.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Script.first
    assert_template 'edit'
  end
  
  def test_update_valid
    Script.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Script.first
    assert_redirected_to scripts_url
  end
end
