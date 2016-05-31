class Api::RoutesController < ApplicationController


  # Tighten this up so it only returns a given user's routes
  def index
    user = current_user
    @routes = Route.where(:user_id => user['id']).order("last_completed DESC")
    p @routes
    render json: @routes
  end

  def show
    @route = Route.find(params[:id])
    render json: @route
  end

  def update
    p "Hit the update route path"
    @route = Route.find(params[:id])
    @route.update(route_params)
    @route.favorite = params[:favorite]
    if @route.save
      render json: @route
    else
      render json: {errors: @route.errors.full_messages.join(", "), status: :unprocessable_entity}
    end
  end

  private

  #Only allow users to edit name or favorite status
  def route_params
    params.require(:route).permit(:id, :name, :favorite)
  end

end
