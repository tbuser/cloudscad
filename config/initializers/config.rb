# CloudSCAD Configuration Variables

# DOT_GIT_PATH = "#{Rails.root}/vendor/dot_git"

REPO_ROOT = case ENV["RAILS_ENV"]
when "production"
  "/srv/git/repositories"
when "development"
  "#{Rails.root}/tmp/git/repositories"
when "test"
  "#{Rails.root}/test/fixtures/git/repositories"
end

OPENSCAD_PATH = if File.exists?("/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD")
  "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"
else
  "/usr/bin/openscad"
end
