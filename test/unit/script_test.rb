require 'test_helper'

class ScriptTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Script.new.valid?
  end
end
