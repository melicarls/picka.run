Rails.application.routes.draw do
  root 'site#index'

  get '/login', :to => 'sessions#new', :as => :login
  get '/auth/:provider/callback', :to => 'sessions#create'
  get '/auth/failure', :to => 'sessions#failure'


  get '*path', to: 'site#index'

end
