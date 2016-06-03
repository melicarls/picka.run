class User < ActiveRecord::Base
  has_many :activities, dependent: :destroy
  has_many :routes, dependent: :destroy

  validates :first_name,
            presence: true,
            length:   { maximum: 255 }
  validates :last_name,
            presence: true,
            length:   { maximum: 255 }
  validates :city,
            presence: true
  validates :state,
            presence: true
  validates :image_url,
            presence: true
  validates :token,
            presence: true
  validates :email,
            presence: true
  validates :strava_id,
            presence: true,
            uniqueness: true

  # Fetch a newly created user's 200 most recent activities from Strava
  def load_initial_activities
    Activity.fetch_user_activities(self, :per_page => 200)
  end

  # Fetch a return user's activities completed between now and the previous visit
  def load_new_activities
    Activity.fetch_user_activities(self, :after => self.last_login.to_i)
  end

end
