class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.string :name
      t.datetime :last_completed
      t.float :distance
      t.integer :avg_time
      t.float :avg_pace
      t.float :map, array: true
      t.float :start_location, array: true
      t.float :end_location, array: true
      t.float :elevation_gain
      t.string :tags, array: true
      t.boolean :favorite

      t.timestamps null: false
    end
  end
end
