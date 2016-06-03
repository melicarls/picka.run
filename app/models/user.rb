class User < ActiveRecord::Base
  has_many :activities
  has_many :routes

  # Fetch a newly created user's 200 most recent activities from Strava
  def load_initial_activities
    Activity.fetch_user_activities(self, :per_page => 200)
  end

  # Fetch a return user's activities completed between now and the previous visit
  def load_new_activities
    Activity.fetch_user_activities(self, :after => self.last_login.to_i)
  end

end
