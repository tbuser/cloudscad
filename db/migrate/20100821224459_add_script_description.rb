class AddScriptDescription < ActiveRecord::Migration
  def self.up
    add_column :scripts, :description, :text
  end

  def self.down
    remove_column :scripts, :description
  end
end
