class CreateIssues < ActiveRecord::Migration
  def change
    create_table :issues do |t|
      t.text :name
      t.text :description
      t.string :state
      t.string :city
      t.string :state
      t.integer :year
      t.string :race

      t.timestamps
    end
  end
end
