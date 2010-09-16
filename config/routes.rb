Rails30::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'

  match 'login' => 'user_sessions#new'
  match 'logout' => 'user_sessions#destroy'

  resources :user_sessions

  resources :users

  resources :projects

  match 'pages/:action' => 'pages'

  post "scad" => 'blobs#scad'

  match ':username' => 'users#show'

  # match ':username/:projectname((/:content_type(/:treeish(/*path))))' => 'projects#show'
  
  scope ':username/:projectname' do
    get '((/:content_type(/:treeish(/*path))))' => 'trees#show', :constraints => {:content_type => /tree/}

    get '((/:content_type(/:treeish(/*path))))' => 'blobs#show', :constraints => {:content_type => /blob|download/}
    get '((/:content_type(/:treeish(/*path))))' => 'blobs#new', :constraints => {:content_type => /blob-new/}
    get '((/:content_type(/:treeish(/*path))))' => 'blobs#edit', :constraints => {:content_type => /blob-edit/}
    post '((/:content_type(/:treeish(/*path))))' => 'blobs#create', :constraints => {:content_type => /blob-create/}
    put '((/:content_type(/:treeish(/*path))))' => 'projects#update', :constraints => {:content_type => /blob-update/}
    delete '((/:content_type(/:treeish(/*path))))' => 'projects#delete', :constraints => {:content_type => /blob-delete/}
    
    post '((/:content_type(/:treeish(/*path))))' => 'blobs#scad', :constraints => {:content_type => /scad/}
  end

  root :to => "projects#index"
end

# ActionController::Routing::Routes.draw do |map|
#   map.login "login", :controller => "user_sessions", :action => "new"
#   map.logout "logout", :controller => "user_sessions", :action => "destroy"
#   
#   map.resources :user_sessions
# 
#   map.resources :users
# 
#   map.resources :scripts, :collection => {:preview => :get}
# 
#   map.root :scripts
# 
#   # map.connect ':controller/:action/:id'
#   # map.connect ':controller/:action/:id.:format'
#   
#   map.connect ':action', :controller => "pages"
# end
