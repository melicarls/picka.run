class SessionsController < ApplicationController
  def new
  end

  def create
    auth_hash = request.env['omniauth.auth']
    user = User.find_by(token: auth_hash[:credentials][:token])
    p "Is ther already a user? ", user
    if !user
      p "Auth hash: ", auth_hash
      user = User.new
      user.token = auth_hash[:credentials][:token]
      user.first_name = auth_hash[:extra][:raw_info][:firstname]
      user.last_name = auth_hash[:extra][:raw_info][:lastname]
      user.city = auth_hash[:extra][:raw_info][:city]
      user.state = auth_hash[:extra][:raw_info][:state]
      user.image_url = auth_hash[:extra][:raw_info][:profile]
      user.email = auth_hash[:extra][:raw_info][:email]
      user.strava_id = auth_hash[:extra][:raw_info][:id]
      p "Newly saved user: ", user
      if user.save
        flash[:success] = "Profile successfully created!"
      else
        flash[:error] = "Something went wrong. Your profile was not created."
      end
    end
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
