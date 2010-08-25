class ScriptsController < ApplicationController
  before_filter :get_script, :except => [:index, :new, :create]
  
  def index
    @scripts = Script.all
  end
  
  def new
    @script = Script.new
  end
  
  def create
    @script = current_user.scripts.build(params[:script])
    if @script.save
      flash[:notice] = "Successfully created script."
      redirect_to scripts_url
    else
      render :action => 'new'
    end
  end

  def show
    respond_to do |format|
      format.html
      format.xml    { render :xml => @script.to_xml }
      format.scad   { render :text => @script.code }
      format.stl    { render :text => @script.to_stl(params) }
      format.json3d { render :text => @script.to_json3d(params) }
      format.js
    end
  end
  
  def edit
  end
  
  def update
    if @script.update_attributes(params[:script])
      flash[:notice] = "Successfully updated script."
      redirect_to script_url(@script)
    else
      render :action => 'edit'
    end
  end

  def destroy
    @script.destroy
    flash[:notice] = "Script successfully deleted."
    redirect_to scripts_url
  end
  
  private
  
  def get_script
    @script = Script.find(params[:id])
  end
end
