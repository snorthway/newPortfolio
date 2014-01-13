d3.csv(csv_url, function(csv){

	var distanceMatrixCities = findDistanceMatrix(csv);

    // append the data to csv info
    for (var i=0; i<csv.length; i++){
            csv[i].dists = distanceMatrixCities[i];
            csv[i].connected = false;
            csv[i].clicked = false;
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

	console.log(csv);
	findMST(csv, false);

});