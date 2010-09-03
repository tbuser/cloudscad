class CreateProjects < ActiveRecord::Migration
  def self.up
    create_table :projects do |t|
      t.integer :user_id
      t.string :name
      t.text :description

      t.timestamps
    end
    
    add_index :projects, :user_id
    add_index :projects, :name
    
    add_index :users, :username
  end

  def self.down
    drop_table :projects
  end
end
