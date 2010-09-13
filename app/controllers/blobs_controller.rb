class BlobsController < ApplicationController
  before_filter :require_user
  before_filter :get_project, :except => [:preview]
  before_filter :get_blob, :ecpt => [:index, :new, :create, :preview]

  respond_to :html, :xml, :json

  def new
    respond_with(@project)
  end

  def create
    @project = current_user.projects.build(params[:project])

    if @project.save
      flash[:notice] = "Successfully created project."
    end
    
    respond_with(@project, :location => @project.url_path("blob", params[:treeish], params[:path]))
  end

  def show
    case params[:content_type]
    when "download"
      render :text => @project.repo.tree(params[:treeish], params[:path]).contents[0].data
      return
    when "blob"
      @blob = @project.repo.tree(params[:treeish], params[:path]).contents[0]
      @extension = File.extname(@blob.name)
    end

    respond_with(@project)
  end

  def edit
    respond_with(@project)
  end

  def update
    if @project.update_blob_attributes(params[:blob])
      flash[:notice] = "Successfully updated file."
      params[:path] = params[:path].split("/")[0..-2].join("/") + params[:blob][:name]
    end
    
    respond_with(@project, :location => @project.url_path("blob", params[:treeish], params[:path]))
  end

  def destroy
    @project.blob_destroy(params[:blob])
    flash[:notice] = "File successfully deleted."
    respond_with(@project)
  end

  def preview
    @scad = Scad.new(:code => params[:code])
    
    params.delete("code")
    
    respond_to do |format|
      format.scad   { render :text  => @scad.code               }
      format.stl    { render :text  => @scad.to_stl(params)     }
      format.json3d { render :text  => @scad.to_json3d(params)  }
      format.js     { render :action => "show" }
    end
  end

  private

  def get_blob
    @blob = @project.repo.tree(params[:treeish], params[:path]).contents[0]
    params[:blob] ||= {:name => @blob.name, :data => @blob.data, :message => ""}
  end

  def get_project
    @project = Project.where(:users => {:username => params[:username]}, :name => params[:projectname]).includes(:user).first

    params[:content_type] ||= "tree"
    params[:treeish] ||= "master"
    params[:path] ||= ""
    params[:path] = params[:path].split("/")
  end
end
