Rails.application.routes.draw do
  
  devise_for :users
  root 'articles#index'
  resources :articles
  get "/users/current", to: "users#current"
end
