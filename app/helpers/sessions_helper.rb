module SessionsHelper

# return the current user, or nil if nobody is logged in
  def current_user
  	@user ||= session[:user_id] && User.find(session[:user_id])
  end

end
