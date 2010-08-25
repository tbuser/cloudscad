class CreateScripts < ActiveRecord::Migration
  def self.up
    create_table :scripts do |t|
      t.string :name
      t.text :code
      t.timestamps
    end
  end
  
  def self.down
    drop_table :scripts
  end
end
