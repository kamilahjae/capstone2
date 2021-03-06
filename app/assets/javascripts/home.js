// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
$("document").ready(function () {
  //grab the text of the initial infoPane h1 and p
  var firstInfoPaneH1 = d3.select(".infoPane")
    .selectAll("#infoPaneMainH1").text();
    console.log("This is the h1 text: ", firstInfoPaneH1);

  var firstInfoPaneP = d3.select(".infoPane")
    .selectAll("#infoPaneMainP").text();
    console.log("This is the p text: ", firstInfoPaneP);

  //set the height and width of the projection
  var width = $("#map").width(),
      height = $("#map").height(),
  // var width = $("#map").width(),
  //     height = $("#map").height(),
      active = d3.select(null); //make sure active is null by default, a safety measure

  var projection = d3.geo.albersUsa() //this a projection of the US and PR with Alaska next to Hawaii
      .scale(1000) //how will the map initially appear in the browser (the size of it)
      .translate([width / 2, height / 2]); //centering the map on the x & y axis

  var zoom = d3.behavior.zoom() //zoom is a behavior with many attributes
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  var path = d3.geo.path()
      .projection(projection);

      // <svg id="map">

      // </svg>

      //make the map responsive:
  var svg = d3.select("#map").append("svg") //insert the svg into the map div
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", width)
      .attr("height", width * height / width)
      .on("click", stopped, true); //on is a behavior listening for the click to happen on the svg

      // <div class="map">
      // <svg width="#{width}" height="#{height}">
      //
      // </svg>
      // </div>

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", reset);

      // <div class="map">
      // <svg width="#{width}" height="#{height}">
      //
      //   <rect class="background" width="#{width}" height="#{height}">
      // </svg>
      // </div>

  var g = svg.append("g");
      // <div class="map">
      // <svg width="#{width}" height="#{height}">
      //
      //   <rect class="background" width="#{width}" height="#{height}">
      //   <g> (g stands for group)
      // </svg>
      // </div>

  svg
    //call means execute this function
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

  d3.json("/states_usa.topo.json", function(error, us) { //read my topo.json file into the json function and then do something. like promises
    console.log(error, us, "this is g:", g);
    g.selectAll("path") //this will give an empty selector (a selector is a selection object), but it is still an empty instance of the d3 class that we can perform actions on
        .data(topojson.feature(us, us.objects.states).features) //.data is a method that says that all actions will be performed on the data in the read file
         //topojson is a class, feature (figure out paths for state lines? read more about this) is a method of that class and we are passing the us variable to that method
      .enter().append("path") //enter tells d3 we will start manipulating this stuff--the data bound to the svg. Like a loop. will perform the following actions in sequence (this is how we get 50 paths for the states)
        .attr("d", path)
        .attr("class", "feature")
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))//the bordering lines are only sketched once
        .attr("class", "mesh")
        .attr("d", path);
  });

  var infoPaneH1;

  function clicked(d) {
    g.selectAll("#cities").remove();
    if (active.node() === this) return reset(); //if you click on an already active state, zoom out
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d), //read more about this. something about scaling; how the animation transforms between actions
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition() //anytime a transition occurs, take this amount of time. and call the following actions
        .duration(750)
        .call(zoom.translate(translate).scale(scale).event);

    var state = d;
    var state_name = state.properties.name;
        console.log("this is state info: ", state);

    //append state_name of the state to infoPaneMain h1 element(s):
    var infoPane = d3.select(".infoPane");
        infoPaneH1 = infoPane.selectAll("#infoPaneMainH1");

        infoPaneH1.text(state_name);


    //append state stats here:
    var data;

    d3.json("/issues.json", function(error, json) {
      if (error) console.warn(error);
      data = json;
      console.log("DATA: ", data);
      data.forEach(function(issue){
        console.log(issue.state);
        showIssue(issue);
      });
    });

    function showIssue(issue_object) {
      console.log(issue_object);
      var infoPaneP = infoPane.selectAll("#infoPaneMainP");
      if (issue_object.state === state_name) {
        return (

        infoPaneP.data([issue_object])
        .text(function(d){return "In " + d.year + ", " +
          issue_object.description + " of " + issue_object.race + " students " +
          "obtained a high school diploma."

          ;})

        //   issue_object.name + ":" +

        .style("font-size", 40 + "px")
      );
    }
    }

    //add tooltip to the city points
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>City:</strong> <span style='color:rgb(252, 163, 0)'>" +
        d.properties.name +
        "</span>";
      });

    svg.call(tip);

    //load the cities onto the map
    d3.json("/cities_usa.topo.json", function(error, us) {
      console.log("this is us:", us);
      g.append("g")
        .attr("id", "cities")
        .selectAll("circle")
        .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
        .enter()
        .append("circle")
        .attr("cx", function(d) { console.log("This should be the city block:", d);
          return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
        })
        .attr("cy", function(d) {
          return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
        })
        .attr("r", 3)
        .style("fill", "rgb(11, 84, 86)")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    });
  }

  function reset() {
    g.selectAll("#cities").remove(); //clear points when user exits state
    active.classed("active", false);
    active = d3.select(null);

    //change infoPane h1 state_name text to intro text when user exits state
    infoPaneH1.text(firstInfoPaneH1);

    //refactor this--make infoPaneP global.
    //change infoPane p text to intro txt when user exists state
    var infoPane = d3.select(".infoPane");
    var infoPaneP = infoPane.selectAll("#infoPaneMainP");

        infoPaneP.text(firstInfoPaneP)
        .style("font-size", 28 + "px");

    //set zoom out transition
    svg.transition()
        .duration(750)
        .call(zoom.translate([0, 0]).scale(1).event);
  }

  function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }

  // create a function that resizes the map to the window size for responsiveness
  $(window).resize(function() {
    var w = $("#map").width(),
        h = $("#map").height();
    svg.attr("width", w);
    svg.attr("height", h);
  });
});
