class CreateGradRates < ActiveRecord::Migration
  def change
    create_table :grad_rates do |t|
      t.string :state
      t.string :race
      t.integer :year

      t.timestamps
    end
  end
end
