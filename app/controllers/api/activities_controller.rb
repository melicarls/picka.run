class Api::ActivitiesController < ApplicationController
  # Tighten this up so it only returns a given user's routes
  def index
    user = current_user
    p "Reached activities controller"
    @activities = Activity.where(:user_id => user['id'], :route_id => params[:route_id])
    render json: @activities
  end

end
