Rails.application.routes.draw do
  root 'site#index'

  get '/login', :to => 'sessions#new', :as => :login
  get '/auth/:provider/callback', :to => 'sessions#create'
  get '/auth/failure', :to => 'sessions#failure'

  namespace :api,defaults: {format: :json} do
    resources :routes, except: [:new, :create, :edit, :destroy]
    get '/activities/:route_id', :to => 'activities#index'
  end

  get '*path', to: 'site#index'

end
