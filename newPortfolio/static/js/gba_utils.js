// width and height of svg element
var w=960, h=900;
// uhh
var zx=w*(3/5), zy=h/2;
// for scaling the distance between nodes
var scale = 750;
// arbitrarily large number to assign connected nodes (when finding MST)
var big = 1000;
// used in MST function
var cityNetworkLength;

// make the svg element
svg=d3.select("#map")
.append("svg")
.attr("width",w)
.attr("height",h)
.style("background-color", "black");

// figure out where to display the nodes
function centerPlace(d, axis){
	if (axis == "x"){
		return zx + scale*d.long_diff;
	} else if (axis == "y"){
		return zy + scale*d.lat_diff;
	}
}

// draw a line between nodes
function drawLine(loc1, loc2, color){
	svg.append("line")
	.style("stroke-width", 2)
	.style("stroke", color)
	.attr("x1",centerPlace(loc1,"x"))
	.attr("y1",centerPlace(loc1,"y"))
	.attr("x2",centerPlace(loc2,"x"))
	.attr("y2",centerPlace(loc2,"y"));
}

// distance function
function findDistance(loc1, loc2){
	return Math.sqrt(Math.pow(loc1.latitude-loc2.latitude, 2)+Math.pow(loc1.longitude-loc2.longitude, 2));
}

// make the distance matrix as a basis for finding the MST
function findDistanceMatrix(csv){
	var distanceMatrix = []
	for (var i=0; i<csv.length; i++){
		distanceMatrix.push([]);
		c1 = csv[i]
		for (var j=0; j<csv.length; j++){
			c2 = csv[j]
			hyp = findDistance(c1, c2);
			if (hyp == 0){
				// put arbitrarily large numbers on the diagonal 
				// so nodes don't connect to themselves
				distanceMatrix[i].push(big);
			} else{
				distanceMatrix[i].push(hyp);
			}	
		}
	}
	return distanceMatrix;
}

// find average minimum distance in a distance matrix
function findAvgMinDistance(distMatrix){
	var total = 0;
	for (i=0;i<distMatrix.length;i++){
		total += Math.min.apply(null, distMatrix[i]);
	}
	return total/distMatrix.length;
}

// find the minimum spanning tree of the network (r is for recursing)
function findMST(data, r){
	if (r == false){
		// set network length to the minimum distance between node 0 and another
		cityNetworkLength = Math.min.apply(null, data[0].dists);
		// find the index of that minimum distance in node 0's distance array
		var indexOfMin = data[0].dists.indexOf(Math.min.apply(null, data[0].dists));
		// update connections and set appropriate values to a large number
		data.connections.push([0,indexOfMin]);
		data[0].connected = true;
		data[0].dists[indexOfMin] = big;
		data[indexOfMin].connected = true;
		data[indexOfMin].dists[0] = big;

		// draw lines here because I suck
		drawLine(data[0], data[indexOfMin], "yellow");

		// recurse!
		findMST(data, true);
	} else {
		// find connected nodes
		var conNodes = data.filter(function (d){return d.connected == true});
		var indexOfMin, conNodeIndex;
		// go through connected nodes and find the shortest distance from one to another
		for (i=0;i<conNodes.length;i++){
			if (i==0){
				var conNodeMin = Math.min.apply(null, conNodes[i].dists);
				indexOfMin = conNodes[i].dists.indexOf(conNodeMin);
				conNodeIndex = i;
			} else {
				newConNodeMin = Math.min.apply(null, conNodes[i].dists);
				var newIndex = conNodes[i].dists.indexOf(newConNodeMin);
				if (newConNodeMin < conNodeMin){
					conNodeMin = newConNodeMin;
					indexOfMin = newIndex;
					conNodeIndex = i;
				}
			}
			
		}
		// add to total network length
		cityNetworkLength += conNodeMin;
		// update all this shit
		var oldNodeIndex = data.indexOf(conNodes[conNodeIndex]);
		data.connections.push([oldNodeIndex, indexOfMin]);
		data[oldNodeIndex].dists[indexOfMin] = big;
		data[indexOfMin].connected = true;
		data[indexOfMin].dists[oldNodeIndex] = big;

		// set some numbers to a large number to avoid using them again
		data.forEach(function(entry){
			if (entry.connected == true){
				for (i=0;i<data.length;i++){
					if (data[i].connected == true){
						entry.dists[i] = big;
					}
				}
			}
		});

		// draw lines here because I suck
		drawLine(data[oldNodeIndex], data[indexOfMin], "yellow");

		// if all nodes are connected, return data
		if (data.every(function (d){return d.connected == true})){
			console.log("cities", cityNetworkLength);
			return data;
		} else {
			// recurse!
			findMST(data, true);
		}
	}
}

