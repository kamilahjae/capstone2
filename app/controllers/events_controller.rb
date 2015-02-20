require "csv"
class EventsController < ApplicationController

  def index
    @state      = [] #state names
    @total      = [] #total men and women
    @male       = [] #men with diplomas
    @female     = [] #women with diplomas
    @maleFemale = [] #men and women with diplomas

    @ratio = []

    CSV.foreach("public/educationData/2013blackByState.csv", :headers => true) do |row|
      @state  << row[2]
      @total  << row[3].to_i
      @male   << row[11].to_i
      @female << row[29].to_i

      @maleFemale << row[11].to_i + row[29].to_i

      @ratio      << (row[11].to_f + row[29].to_f) / row[3].to_f
    end
  end

  def show
    # redirect_to "show"
  end
end
