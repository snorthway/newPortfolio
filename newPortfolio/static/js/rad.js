var w=960, h=500,
svg=d3.select("#map")
.append("svg")
.attr("width", w)
.attr("height", h);

var text=svg
.append("text")
.text("hello world")
.attr("y", 50);