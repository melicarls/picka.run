Rails.application.routes.draw do
  root 'site#index'

  get '/auth/:provider/callback', :to => 'sessions#create'
  get '/auth/failure', :to => 'sessions#failure'
  get '/logout', :to => 'sessions#destroy', :as => :logout

  namespace :api,defaults: {format: :json} do
    resources :routes, except: [:new, :create, :edit]
    get '/activities/:route_id', :to => 'activities#index'
    get '/users/:id', :to => 'users#show'
  end

  get '*path', to: 'site#index'

end
