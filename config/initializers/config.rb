# CloudSCAD Configuration Variables

DOT_GIT_PATH = "#{Rails.root}/vendor/dot_git"

REPO_ROOT = if ENV["RAILS_ENV"] == "production"
  "/home/git/repositories"
else
  "#{Rails.root}/tmp/git/repositories"
end

OPENSCAD_PATH = if File.exists?("/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD")
  "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"
else
  "/usr/local/bin/openscad"
end
