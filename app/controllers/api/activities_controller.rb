class Api::ActivitiesController < ApplicationController

  def index
    user = current_user
    @activities = Activity.where(:user_id => user['id'], :route_id => params[:route_id])
    render json: @activities
  end

end
