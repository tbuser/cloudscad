class ScriptsController < ApplicationController
  before_filter :require_user

  before_filter :get_script, :except => [:index, :new, :create, :preview]
  
  def index
    @scripts = Script.paginate :page => params["page"], :order => "created_at DESC"

    respond_to do |format|
      format.html
      format.xml { render :xml => @scripts }
    end
  end
  
  def new
    @script = Script.new
  end
  
  def create
    @script = current_user.scripts.build(params[:script])
    
    respond_to do |format|
      if @script.save
        flash[:notice] = "Successfully created script."
        format.html { redirect_to @script }
        format.xml { render :xml => @script, :status => :created, :location => @script }
      else
        format.html { render :action => 'new' }
        format.xml { render :xml => @script.errors, :status => :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      format.html
      format.xml    { render :xml   => @script                    }
      format.scad   { render :text  => @script.code               }
      format.stl    { render :text  => @script.to_stl(params)     }
      format.json3d { render :text  => @script.to_json3d(params)  }
      format.js
    end
  end
  
  def edit
  end
  
  def update
    respond_to do |format|
      if @script.update_attributes(params[:script])
        flash[:notice] = "Successfully updated script."
        format.html { redirect_to @script }
        format.xml { head :ok }
      else
        format.html { render :action => 'edit' }
        format.xml { render :xml => @script.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @script.destroy
    flash[:notice] = "Script successfully deleted."
    
    respond_to do |format|
      format.html { redirect_to scripts_url }
      format.xml { head :ok }
    end
  end
  
  def preview
    @script = Script.new(:code => params["code"])
    
    respond_to do |format|
      format.scad   { render :text  => @script.code               }
      format.stl    { render :text  => @script.to_stl(params)     }
      format.json3d { render :text  => @script.to_json3d(params)  }
      format.js     { render :action => "show" }
    end
  end
  
  private
  
  def get_script
    @script = Script.find(params[:id])
  end
end
