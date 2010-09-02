set :application, "cloudscad"
set :repository,  "git@cloudscad.beanstalkapp.com:/cloudscad.git"

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :branch, "master"
set :deploy_via, :remote_cache

set :deploy_to, "/home/www/www.cloudscad.com"

default_run_options[:pty] = true
set :user, "cloudscad"
set :password, "m0by!"
set :ssh_options, { :forward_agent => true }

role :web, "174.143.174.217"                          # Your HTTP server, Apache/etc
role :app, "174.143.174.217"                          # This may be the same as your `Web` server
role :db,  "174.143.174.217", :primary => true # This is where Rails migrations will run
# role :db,  "your slave db-server here"

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

after "deploy:setup" do
  run "#{try_sudo} /bin/chown -R #{user}:#{user} #{deploy_to}"

  database_configuration = <<-EOF
login: &login
  adapter: mysql
  host: localhost
  username: #{user}
  password: #{password}

development:
  database: <%= "#{application}_dev" %>
  <<: *login

test:
  database: <%= "#{application}_test" %>
  <<: *login

production:
  database: <%= "#{application}" %>
  <<: *login
EOF

  run "mkdir -p #{deploy_to}/shared/config" 
  put database_configuration, "#{deploy_to}/shared/config/database.yml" 

  # run "ln -nfs #{deploy_to}/shared/config/database.yml #{release_path}/config/database.yml"

  run "#{try_sudo} /bin/chown -R #{user}:#{user} #{deploy_to}"  
end

after "deploy:update_code" do
  run "ln -nfs #{deploy_to}/shared/config/database.yml #{release_path}/config/database.yml"
end

# after "deploy:update_code", "gems:install"
# 
# namespace :gems do
#   desc "Install gems"
#   task :install, :roles => :app do
#     run "cd #{current_release} && #{sudo} rake gems:install"
#   end
# end

namespace :bundle do
  task :create_symlink, :roles => :app, :except => { :no_release => true } do
    shared_bundle = File.join(shared_path, 'vendor/bundle')
    release_bundle = File.join(release_path, 'vendor/bundle')
    # if you don't commit your cache, add cache to this list
    run("mkdir -p #{shared_bundle} && mkdir -p #{release_bundle} && ln -s #{shared_bundle} #{release_bundle}")
  end
  
  task :install, :roles => :app, :except => { :no_release => true }  do
    bundle.create_symlink
    run("cd #{release_path} && #{try_sudo} bundle install --deployment")
  end
end

after 'deploy:update_code', 'bundle:install'
