Rails.application.routes.draw do
  
  root 'articles#index'
  resources :articles, only: [:index, :create, :new]
end
