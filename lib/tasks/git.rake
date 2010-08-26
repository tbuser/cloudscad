namespace :git do
  desc "Configure Rails for git"
  task :configure do
    system "echo '*.log' >> log/.gitignore"
    system "echo '*.db' >> db/.gitignore"
    system "mv config/database.yml config/database.yml.example"
    system "echo 'database.yml' >> config/.gitignore"
    system "echo 'cache' >> tmp/.gitignore"
    system "echo 'pids' >> tmp/.gitignore"
    system "echo 'session' >> tmp/.gitignore"
    system "echo 'sockets' >> tmp/.gitignore"
  end
end