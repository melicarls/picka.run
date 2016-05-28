class Route < ActiveRecord::Base

  # Run this for all newly created activities
  def self.match_to_route(user, activity)
    matched = false
    # Get all routes that belong to a user
    p "Checking a new activity! ", activity
    p "This is the user whose routes we're generating: ", user
    @routes = Route.where(:user_id => user[:id])
    p "The user has these routes: ", @routes
    if !@routes.empty?
      @routes.each do |route|
        p "Comparing activity distance: ", (activity.distance * 0.000621371)
        p "to route distance: ", (route.distance * 0.000621371)
        # Check distance
        if (activity.distance * 0.000621371).between?(((route.distance * 0.000621371) - 0.25), ((route.distance * 0.000621371) + 0.25))
          p "The activity is within the acceptable distance"
        # If it's a match, compare the map points
          # Find the point that is furthest from route's start
          route_farthest = farthest_point(route.map, route.start_location)
          p "Here's the route's farthest point: ", route_farthest
          # Find the point that is furthest from the activity's start
          activity_farthest = farthest_point(activity.map, activity.start_location)
          p "Here's the activity's farthest point: ", activity_farthest
          if route_farthest == activity_farthest
            p "The activity's farthest point lines up with the route's farthest point"
            matched = true
            p "Changing matched to true!", matched
            # If they match, add the activity to the routes and vice versa. This is done in the reset avgs function
            # Adjust the route to account for the way that the newly added activity should change its averages
            reset_route_avgs(activity, route)
          end
        end
      end
    end
    # Create a new route if the activity still hasn't been matched
    if !matched
      p "The activity couldn't be matched to any existing routes"
      p user
      create_route_from_activity(user, activity)
    end
  end

  # Run this when a route could not be found for an activity
  def self.create_route_from_activity(user, activity)
    r = Route.new
    r.name = (activity.distance * 0.000621371).round(0).to_s + " mile route"
    r.last_completed = activity.date
    r.distance = activity.distance
    r.avg_time = activity.time
    r.avg_pace = activity.pace
    r.map = activity.map
    r.start_location = activity.start_location
    r.end_location = activity.end_location
    r.elevation_gain = activity.elevation_gain
    r.tags = []
    r.favorite = false
    r.user_id = user[:id]
    if r.save
      p "New route created"
      apply_tags(r)
    else
      p "Something went wrong making that route"
    end
  end


  # Run this when a route is matched to an activity
  def self.reset_route_avgs(activity, route)
    p "Route's averages are being reset since a new activity was matched"
    route_activities = Activity.where(:route_id => route[:id])
    p "Here are the activities associated with the route", route_activities
    num_activities = route_activities.length
    # Reset the route attributes that depend on averages
    route.distance = ((route.distance * num_activities) + activity.distance) / (num_activities + 1)
    route.avg_time = ((route.avg_time * num_activities) + activity.time) / (num_activities + 1)
    route.avg_pace = ((route.avg_pace * num_activities) + activity.pace) / (num_activities + 1)
    # Add the route's id to the activity so it will be called up the next time this function is fun
    p "This is the route's id: ", route[:id]
    activity[:route_id] = route[:id]
    p "Here's reference key on the activity: ", activity[:route_id]
  end



  def self.apply_tags(route)
    if route.elevation_gain > 400
      route.tags.push("Very hilly")
    end
    if route.elevation_gain < 400 && route.elevation_gain > 50
      route.tags.push("Hilly")
    end
    if route.elevation_gain < 50
      route.tags.push("Flat")
    end
    if route.start_location[0] != route.end_location[0] && route.start_location[1] != route.end_location[1]
      route.tags.push("One-way")
    else
      route.tags.push("Round trip")
    end
  end

  # Returns the fartest point from the starting point
  def self.farthest_point(point_array, starting_point)
    biggest_distance = 0
    farthest_pair = nil
    point_array.each do |set|
      distance = getDistanceFromLatLonInKm(set[0], set[1], starting_point[0], starting_point[1])
      if distance > biggest_distance
        biggest_distance = distance
        farthest_pair = set
      end
    end
    # Need to return this pair with a fixed number of decimal points
    five_decimal_points(farthest_pair)
  end

  def self.five_decimal_points(pair)
    p "Here's the rounded pair: ", [pair[0].round(5), pair[1].round(5)]
    return [pair[0].round(5), pair[1].round(5)]
  end

#Returns distance between two given sets of coordinates
  def self.getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)
    r = 6371
    dLat = deg2rad(lat2-lat1)
    dLon = deg2rad(lon2-lon1)
    a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    r * c
  end

#Converter
  def self.deg2rad(deg)
    return deg * (3.141592653589793/180)
  end

end
