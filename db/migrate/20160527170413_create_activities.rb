class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :name
      t.datetime :date
      t.float :distance
      t.integer :time
      t.float :pace
      t.float :map, array: true
      t.integer :strava_id
      t.float :start_location, array: true
      t.float :end_location, array: true
      t.float :elevation_gain

      t.timestamps null: false
    end
  end
end
