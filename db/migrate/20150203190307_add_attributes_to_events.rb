class AddAttributesToEvents < ActiveRecord::Migration
  def change
    add_column :events, :name, :string
    add_column :events, :location, :integer
    add_column :events, :description, :text
    add_column :events, :pubYear, :integer
  end
end
