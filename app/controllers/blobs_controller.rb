class BlobsController < ApplicationController
  before_filter :require_user
  before_filter :get_project, :except => [:scad]
  before_filter :get_blob, :except => [:index, :new, :create, :scad]
  before_filter :check_project_permissions, :except => [:index, :show, :scad]

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
    # when "stl"
    #   @scad = Scad.new(:project => @project, :treeish => params[:treeish], :path => params[:path])
    #   render :text  => @scad.to_stl(params)
    when "download"
      send_data @blob.data, :type => @blob.mime_type
      return
    when "blob"
      # @blob = @project.repo.tree(params[:treeish], params[:path]).contents[0]
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

  def scad
    @scad = Scad.new(params)
    
    params.delete("code")
    params.delete("content_type")
    params.delete("utf8")
    params.delete("authenticity_token")
    params.delete("commit")

    if params[:path]
      @filename = params[:path].split("/")[-1]
    else
      @filename = "untitled.scad"
    end
    
    respond_to do |format|
      format.scad   { send_data @scad.code, :filename => @filename.gsub(/\..*$/, '.scad') }
      format.stl    { send_data @scad.to_stl(params)[:stl_data], :filename => @filename.gsub(/\..*$/, '.stl') }
      format.json3d { send_data @scad.to_json3d(params), :filename => @filename.gsub(/\..*$/, '.json')  }
      format.js     { @stl_hash = @scad.to_stl(params) }
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
    params[:treeish]      ||= "master"
    params[:path]         ||= ""
    params[:path]         = params[:path].split("/")
  end
end
