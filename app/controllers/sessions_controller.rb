class SessionsController < ApplicationController
  def new
  end

  def create
    auth_hash = request.env['omniauth.auth']
    p auth_hash
    render :text => auth_hash.inspect
  end

  def failure
    flash[:error] = "Your account could not be authenticated"
    redirect_to :index
  end
end
