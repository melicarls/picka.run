class Activity < ActiveRecord::Base
  belongs_to :user
  belongs_to :route

  validates :name,
            presence: true,
            length:   { maximum: 255 }
  validates :distance,
            presence: true
  validates :time,
            presence: true
  validates :pace,
            presence: true
  validates :map,
            presence: true
  validates :strava_id,
            presence: true
  validates :start_location,
            presence: true
  validates :end_location,
            presence: true
  validates :elevation_gain,
            presence: true
  validates :user_id,
            presence: true
  validates :route_id,
            presence: true

  def self.fetch_user_activities(user, params)
    # fetch all of the current user's activities from strava
    @client = Strava::Api::V3::Client.new(:access_token => user.token)
    @activities = @client.list_athlete_activities(params)
    # iterate through activities
    # save all activities that are new, that are runs, and that have GPS data to the database
    @activities.each do |el|
      if !Activity.find_by(strava_id: el["id"]) && el["type"] == "Run" && el["map"]["summary_polyline"] != nil
        a = Activity.new
        a.name=el["name"]
        a.date=Time.parse(el["start_date_local"])
        a.distance=meters_to_miles(el["distance"])
        a.time=el["elapsed_time"]
        a.pace=el["average_speed"]
        a.map=Polylines::Decoder.decode_polyline(el["map"]["summary_polyline"])
        a.strava_id=el["id"]
        a.start_location=el["start_latlng"]
        a.end_location=el["end_latlng"]
        a.elevation_gain=el["total_elevation_gain"]
        a.user_id=user.id
        if a.save
          # establish a link between the new activity and a new or existing route
          Route.match_to_route(user, a)
        end
      end
    end
  end

  def self.meters_to_miles(distance)
    (distance * 0.000621371).round(2)
  end

end
