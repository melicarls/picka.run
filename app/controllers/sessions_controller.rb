class SessionsController < ApplicationController

  def create
    auth_hash = request.env['omniauth.auth']
    user = User.find_by(strava_id: auth_hash[:extra][:raw_info][:id])
    if !user
      user = User.new
      user.token = auth_hash[:credentials][:token]
      user.first_name = auth_hash[:extra][:raw_info][:firstname]
      user.last_name = auth_hash[:extra][:raw_info][:lastname]
      user.city = auth_hash[:extra][:raw_info][:city]
      user.state = auth_hash[:extra][:raw_info][:state]
      user.image_url = auth_hash[:extra][:raw_info][:profile]
      user.email = auth_hash[:extra][:raw_info][:email]
      user.strava_id = auth_hash[:extra][:raw_info][:id]
      user.last_login = DateTime.now
      if user.save
        flash[:success] = "Profile successfully created. Welcome!"
        user.load_initial_activities
      else
        flash[:error] = "Something went wrong. Your profile was not created."
      end
    else
      user.load_new_activities
      user.token = auth_hash[:credentials][:token]
      user.last_login = DateTime.now
      user.save
      flash[:success] = "You have been logged in. Welcome back!"
    end
    redirect_to api_routes_path
  end

  def failure
    flash[:error] = "Your account could not be authenticated"
    redirect_to :index
  end

  def destroy
    session[:user_id] = nil
    flash[:success] = "You have logged out!"
    redirect_to :index
  end

end
