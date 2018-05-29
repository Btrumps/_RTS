var openList = [];
var closedList = [];

// still need to plug in endTile somewhere below

function findPath(startTile, endTile) {
	openList.push(startTile);

    // gets lowest f cost to process next
    while(openList.length > 0) {
        var lowestFCostIndex = 0;

        for (var i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestFCostIndex].f) {
                lowestFCostIndex = i;
            }
        }

        var currentTile = openList[lowestFCostIndex];

        // end case
        if (currentTile.elementType == DEST) {
            var current = currentTile;
           
           	var returnPath = [];
            while (current.cameFrom) {
                returnPath.push(current);
                current.elementType = PATH;
                current = current.cameFrom;
            }

            return returnPath.reverse();
        }

        // normal case -- move current Node from open to closed
        // then process each of its neighbors
        arrayRemove(openList, currentTile);
        closedList.push(currentTile);
        var neighbors = currentTile.getNeighbors();

        for (var i = 0; i < neighbors.length; i++) {
            if (arrayContains(closedList, neighbors[i]) ||
                neighbors[i].elementType == WALL) {
                // not a valid tile to process, skip to the next neighbor
                continue;
            }

            if (arrayContains(openList, neighbors[i]) == false) {
                openList.push(neighbors[i]);
            }

            var tentative_gScore = currentTile.g + neighbors[i].g;
            var beenVisited = neighbors[i].visited;

            if (beenVisited == false || tentative_gScore < neighbors.g) {

                // this is the best found path so far! record it!
                neighbors[i].visited = true;
                neighbors[i].cameFrom = currentTile;
                neighbors[i].g = tentative_gScore;
                neighbors[i].f = neighbors[i].g + neighbors[i].h;
            }
        }

    }
}