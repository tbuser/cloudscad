set :application, "cloudscad"
set :repository,  "git@cloudscad.beanstalkapp.com:/cloudscad.git"

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :branch, "master"
set :deploy_via, :remote_cache

set :deploy_to, "/home/www/www.cloudscad.com"

# default_run_options[:pty] = true
set :user, "cloudscad"
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
