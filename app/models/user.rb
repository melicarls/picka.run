class User < ActiveRecord::Base

  # ONLY run for newly created users
  def load_initial_activities
    p "loading initial activities for user #{id}"
    Activity.fetch_user_activities(self, :per_page => 200)
  end

  # ONLY run for return users to get activities completed between now and the previous visit
  def load_new_activities
    p "loading new activities for user #{id}"
    Activity.fetch_user_activities(self, :after => self.last_login)
  end
  
end
