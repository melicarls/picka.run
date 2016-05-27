class Activity < ActiveRecord::Base

  def self.fetch_user_activities(user, params)
    @client = Strava::Api::V3::Client.new(:access_token => user.token)
    @activities = @client.list_athlete_activities(params)
    p "All activities: ", @activities
    @activities.each do |el|
      p "This is the element", el
      if !Activity.find_by(strava_id: el["id"]) && el["type"] == "Run" && el["map"]["summary_polyline"] != nil
        a = Activity.new
        a.name=el["name"]
        a.date=Time.parse(el["start_date_local"]) #*convert to dateTime
        a.distance=el["distance"]
        a.time=el["elapsed_time"]
        a.pace=el["average_speed"]
        a.map=Polylines::Decoder.decode_polyline(el["map"]["summary_polyline"]) #*convert to array of points
        a.strava_id=el["id"]
        a.start_location=el["start_latlng"]
        a.end_location=el["end_latlng"]
        a.elevation_gain=el["total_elevation_gain"]
        a.user_id=user.id
        if a.save
          p "Activity saved", a
        end
      end
    end
  end


end
