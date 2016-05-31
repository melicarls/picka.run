class Api::UsersController < ApplicationController

  def show
    @user = User.find(current_user['id'])
    render json: @user
  end

end
