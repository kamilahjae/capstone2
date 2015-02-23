class IssuesController < ApplicationController
  def index

    @issues = Issue.all

    respond_to do |format|
      format.html
      format.json { render json: @issues }
    end

  end
end
