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

namespace :bundler do
  # task :install, :roles => :app, :except => { :no_release => true }  do
  #   run("gem install bundler --source=http://gemcutter.org")
  # end
  # 
  # task :symlink_vendor, :roles => :app, :except => { :no_release => true } do
  #   shared_gems = File.join(shared_path, 'vendor/gems/ruby/1.8')
  #   release_gems = "#{release_path}/vendor/gems/ruby/1.8"
  #   # if you don't commit your cache, add cache to this list
  #   %w(gems specifications).each do |sub_dir|
  #     shared_sub_dir = File.join(shared_gems, sub_dir)
  #     run("mkdir -p #{shared_sub_dir} && mkdir -p #{release_gems} && ln -s #{shared_sub_dir} #{release_gems}/#{sub_dir}")
  #   end
  # end

  task :bundle_new_release, :roles => :app, :except => { :no_release => true }  do
    # bundler.symlink_vendor
    # if you don't commit your cache, remove --cached from this line
    # run("cd #{release_path} && #{try_sudo} gem bundle --only #{rails_env} --cached")
    rails_env = variables[:rails_env] || 'production'
    run("cd #{release_path} && #{try_sudo} bundle install --only #{rails_env}")
  end
end

after 'deploy:update_code', 'bundler:bundle_new_release'
