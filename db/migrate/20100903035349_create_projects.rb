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
    
    drop_table :scripts
  end

  def self.down
    create_table "scripts", :force => true do |t|
      t.string   "name"
      t.text     "code"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.integer  "user_id"
      t.text     "description"
    end
    
    drop_table :projects
  end
end
