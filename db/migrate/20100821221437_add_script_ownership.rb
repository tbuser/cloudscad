class AddScriptOwnership < ActiveRecord::Migration
  def self.up
    add_column :scripts, :user_id, :integer
  end

  def self.down
    remove_column :scripts, :user_id
  end
end
