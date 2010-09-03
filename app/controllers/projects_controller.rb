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
    
    respond_with(@project)
  end

  def show
    respond_with(@project)
  end

  def edit
    respond_with(@project)
  end

  def update
    if @project.update_attributes(params[:project])
      flash[:notice] = "Successfully updated project."
    end
    respond_with(@project)
  end

  def destroy
    @project.destroy
    flash[:notice] = "project successfully deleted."
    respond_with(@project)
  end

  private

  def get_project
    @project = Project.find(params[:id])
  end
end
