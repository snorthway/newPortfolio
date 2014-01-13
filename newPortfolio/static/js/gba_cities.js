d3.csv(csv_url, function(csv){

	// make numbers slightly easier to deal with
	for (var i=0; i<csv.length; i++){
		csv[i].latitude = Math.round(csv[i].latitude*100)/100;
		csv[i].longitude = Math.round(csv[i].longitude*100)/100;
	}

	var distanceMatrixCities = findDistanceMatrix(csv);

    // append the data to csv info
    for (var i=0; i<csv.length; i++){
            csv[i].dists = distanceMatrixCities[i];
            csv[i].connected = false;
            csv[i].clicked = false;
            csv[i].x = centerPlace(csv[i],"x");
            csv[i].y = centerPlace(csv[i],"y");
    }
    csv.connections = []

	// make the circles, give them csv as data
	var townNodes = svg.selectAll("circle")
	.data(csv)
	.enter()
	.append("circle");

	//style and position
	var drawnTownLength = 0;
	var circleAttributes = townNodes
	.style("stroke", "gray")
	.style("fill", "yellow")
	.attr("r", 7)
	.attr("cx", function (d){return centerPlace(d, "x")})
	.attr("cy", function (d){return centerPlace(d, "y")})
	.on("click", function (d){
		if (d.clicked == true){
			d3.select(this).style("fill", "yellow");
			d.clicked = false;
		} else {
			d3.select(this).style("fill", "red");
			d.clicked = true;
		}
		var clickedTowns = townNodes.data().filter(function(data){return data.clicked == true;});
		if (clickedTowns.length == 2){
			drawLine(clickedTowns[0], clickedTowns[1], "red");
			townNodes.data().forEach(function(entry){entry.clicked = false;});
			drawnTownLength += findDistance(clickedTowns[0], clickedTowns[1]);
			console.log("total length: ", drawnTownLength);
		}
	});

	// make the labels, give them csv as data
	var labels = svg.selectAll("text")
	.data(csv)
	.enter()
	.append("text");

	// style and position and text
	var labelAttributes = labels
	.style("font-size", "10px")
	.style("fill","white")
	.attr("x", function (d){return centerPlace(d, "x")})
	.attr("y", function (d){return centerPlace(d, "y")})
	.text(function (d){return d["City"]});

	findMST(csv, false);

	// make a grid of evenly spaced points
	function makeGrid(){
		var startX = 149;
		var startY = 119;
		var interval = 6;
		var nodeArray = [];
		for (var i=0; i<660; i+=interval){
			for (var j=0; j<660; j+=interval){
				nodeArray.push({x:startX+i,y:startY+j,city:null});
			}
		}
		return nodeArray;
	}

	var grid = makeGrid();

	// show grid nodes
	gridNodes = svg.selectAll("rect")
	.data(grid)
	.enter()
	.append("rect")
	.attr("x", function (d){return d.x})
	.attr("y", function (d){return d.y})
	.attr("width", 2)
	.attr("height", 2)
	.style("fill", "green")
	.style("stroke", "green");



});

