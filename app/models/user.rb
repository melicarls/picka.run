class User < ActiveRecord::Base

  def load_initial_activities
    # ONLY run for newly created users
    p "loading initial activities for user #{id}"
    Activity.fetch_user_activities(self)
  end

  def load_new_activities
    # ONLY run if the last activity is within a certain timeframe
    p "loading new activities for user #{id}"
  end
end
