class UsersController < ApplicationController
  before_filter :require_no_user, :only => [:new, :create]
  before_filter :require_user, :only => [:edit, :update]

  before_filter :get_user, :except => [:new, :create]

  before_filter :check_user_permissions, :except => [:index, :show, :new, :create]
  
  def new
    @user = User.new
  end
  
  def create
    # Everyone will now know the invite code OH NOES!  Please be gentle on the poor test server...
    if ['teaearlgreyhot'].include?(params[:invitation_code])
      ok = true
    else
      ok = false
    end

    @user = User.new(params[:user])
    
    if ok and @user.save
      flash[:notice] = "Registration successful."
      redirect_back_or_default root_url
    else
      @user.errors.add_to_base "Invitation Code was incorrect, maybe he didn't like the cookies..." unless ok      
      render :action => 'new'
    end
  end
  
  def show
    if @user.nil?
      # FIXME: pages shortcut fallthrough?
      redirect_to "/pages/#{params[:username]}"
    else
      @projects = @user.projects.paginate :page => params["page"], :order => "created_at DESC"

      respond_to do |format|
        format.html
        format.xml { render :xml => @user.to_xml(:except => [:crypted_password, :password_salt, :persistence_token]) }
      end
    end
  end
  
  def edit
  end
  
  def update
    respond_to do |format|
      if @user.update_attributes(params[:user])
        flash[:notice] = "Successfully updated profile."
        format.html { redirect_to @user }
        format.xml { head :ok }
      else
        format.html { render :action => 'edit' }
        format.xml { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  private
  
  def get_user
    if params[:id].to_s != ""
      @user = User.find(params[:id])
    elsif params[:username].to_s != ""
      @user = User.where(:username => params[:username]).first
    end    
  end
  
  def check_user_permissions
    permission_denied unless @user == current_user
  end
end
