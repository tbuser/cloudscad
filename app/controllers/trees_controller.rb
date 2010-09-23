class TreesController < ApplicationController
  before_filter :require_user
  before_filter :get_project, :except => [:index, :new, :create, :preview]
  before_filter :check_project_permissions, :except => [:index, :show]

  respond_to :html, :xml, :json

  def new
    @project = Project.new
    respond_with(@project)
  end

  def create
    if @project.create_tree(params[:tree])
      flash[:notice] = "Successfully created directory."
    end
    
    respond_with(@project, :location => @project.url_path("tree", params[:treeish], params[:path]))
  end

  def show
    respond_with(@project)
  end

  def edit
    respond_with(@project)
  end

  def update
    if @project.update_tree_attributes(params[:tree])
      flash[:notice] = "Successfully updated directory."
    end
    
    respond_with(@project, :location => @project.url_path("tree", params[:treeish], params[:path]))
  end

  def destroy
    @project.destroy_tree(params[:tree])
    flash[:notice] = "Directory successfully deleted."
    respond_with(@project)
  end

  private

  def get_project
    @project = Project.where(:users => {:username => params[:username]}, :name => params[:projectname]).includes(:user).first

    params[:content_type] ||= "tree"
    params[:treeish]      ||= "master"
    params[:path]         ||= ""
    params[:path]         = params[:path].split("/")
  end
end
