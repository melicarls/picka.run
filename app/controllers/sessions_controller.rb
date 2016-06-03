class SessionsController < ApplicationController

  # strava oauth redirects here
  def create
    auth_hash = request.env['omniauth.auth']
    user = User.find_by(strava_id: auth_hash[:extra][:raw_info][:id])
    # if a user cannot be found by strava id, create a new record
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
        # fetch all of the user's activities from Strava
        user.load_initial_activities
      else
        flash[:error] = "Something went wrong. Your profile was not created."
      end
    else
      # if a user is a return visitor, fetch all activities completed since last login
      user.load_new_activities
      # set the user's token
      user.token = auth_hash[:credentials][:token]
      user.last_login = DateTime.now
      user.save
      flash[:success] = "You have been logged in. Welcome back!"
    end
    # establish a session and redirect to rout search page
    session[:user_id] = user.id
    redirect_to '/routes'
  end

  # TODO: not restful, needs to be revisited
  def demo
    # log user in as Melissa Carlson
    @user = User.find_by(:strava_id => 12036596)
    flash[:success] = "You have been logged in to a test account. Welcome!"
    session[:user_id] = @user.id
    render json: @user
  end

  def failure
    flash[:error] = "Your account could not be authenticated."
    redirect_to :index
  end

  def destroy
    session[:user_id] = nil
    flash[:success] = "You have been logged out."
    redirect_to '/'
  end

end
