class ProjectsController < ApplicationController
  before_filter :require_user
  before_filter :get_project, :except => [:index, :new, :create]

  respond_to :html, :xml, :json

  def index
    @projects = Project.paginate :page => params["page"], :order => "created_at DESC"
    respond_with(@projects)
  end

  def new
    @project = Project.new
    respond_with(@project)
  end

  def create
    @project = current_user.projects.build(params[:project])

    if @project.save
      flash[:notice] = "Successfully created project."
    end
    
    respond_with(@project, :location => @project.url_path)
  end

  def show
    case params[:content_type]
    when "raw"
      render :text => @project.repo.tree(params[:treeish], params[:path]).contents[0].data
    when "blob"
      @blob = @project.repo.tree(params[:treeish], params[:path]).contents[0]
      @extension = File.extname(@blob.name)
      respond_with(@project)
    else
      respond_with(@project)
    end
  end

  def edit
    respond_with(@project)
  end

  def update
    if @project.update_attributes(params[:project])
      flash[:notice] = "Successfully updated project."
    end
    
    respond_with(@project, :location => @project.url_path)
  end

  def destroy
    @project.destroy
    flash[:notice] = "project successfully deleted."
    respond_with(@project)
  end

  private

  def get_project
    if params[:id].to_s != ""
      @project = Project.find(params[:id])
      params[:username] = @project.user.username
      params[:projectname] = @project.name
    elsif params[:username].to_s != "" and params[:projectname].to_s != ""
      @project = Project.where(:users => {:username => params[:username]}, :name => params[:projectname]).includes(:user).first
    end

    params[:content_type] ||= "tree"
    
    params[:treeish] ||= "master"
    
    params[:path] ||= ""
    
    params[:path] = params[:path].split("/")
  end
end
