class Api::ActivitiesController < ApplicationController
  # Tighten this up so it only returns a given user's routes
  def index
    p "Reached activities controller"
    @activities = Activity.where(:route_id => params[:route_id])
    render json: @activities
  end

end
