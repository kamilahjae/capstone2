class RemoveLatLongFromEvents < ActiveRecord::Migration
  def change
    remove_column :events, :latitude, :integer
    remove_column :events, :longitude, :integer
  end
end
