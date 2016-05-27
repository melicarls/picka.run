class AddRouteToActivities < ActiveRecord::Migration
  def change
    add_reference :activities, :route, index: true, foreign_key: true
  end
end
