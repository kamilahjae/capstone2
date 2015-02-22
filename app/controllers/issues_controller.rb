class IssuesController < ApplicationController
  def index
    # issues = {}
    #
    # issues[:state]         = Issue.pluck(:state)
    # issues[:name]          = Issue.pluck(:name)
    # issues[:year]          = Issue.pluck(:year)
    # issues[:race]          = Issue.pluck(:race)
    # issues[:description]   = Issue.pluck(:description)
    #
    # issues = {}
    #
    # state_name  = []
    # issue_name  = []
    # year        = []
    # race        = []
    # description = []
    #
    # state_name  << Issue.pluck(:state)
    # issue_name  << Issue.pluck(:name)
    # year        << Issue.pluck(:year)
    # race        << Issue.pluck(:race)
    # description << Issue.pluck(:description)

    #use active record?

    @issues = Issue.all

    respond_to do |format|
      format.html
      format.json { render json: @issues }
    end
    
  end
end
