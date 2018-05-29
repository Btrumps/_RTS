function tileClass() {
  this.tilC;
  this.tilR; // so each tile knows its own col and row position in overall grid
  this.tilIdx;
  this.visited = false;
                  
  this.elementType;
  this.distance;
  this.cameFrom; // GridElement reference to which tile we left to reach this one
  
  this.g; // distance from starting node
  this.h; // distance from end node
  this.f; // sum of the g and h

  this.distFrom = function(toCol, toRow) {
    var deltaX = toCol - this.tilC;
    var deltaY = toRow - this.tilR;

    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  }
  
  this.setup = function(myC, myR, myIdx, myElement) {
    this.reset();
    this.tilC=myC;
    this.tilR=myR;
    this.tilIdx=myIdx;
    this.elementType=myElement;

    if(this.elementType == SOURCE) {
        initialTile = this;
    } else if (this.elementType == DEST) {
        endTile = this;
    }

  }

  this.recalculateCosts = function() {
      this.g = this.distFrom(initialTile.tilC, initialTile.tilR);
      this.h = this.distFrom(endTile.tilC, endTile.tilR);
      this.f = this.g + this.h;
  }

  this.reset = function() {
    if (this.elementType==VISITED || this.elementType==PATH) {
      this.elementType=NOTHING;
    }
    this.cameFrom = null;
  }
    
  this.setTile = function(toType) {
    this.elementType=toType;
  }

  function GetGridAtCR(atC,atR) {
    return grid[atC + atR * TILE_COLS];
  }
  
  this.getNeighbors = function() {
    var myNeighbors = [];
    var consideredNeighbor;
    
    if(this.tilC > 0) {
      consideredNeighbor = GetGridAtCR(this.tilC-1,this.tilR);
      myNeighbors.push( consideredNeighbor );
    }

    if(this.tilC > 0 && this.tilR > 0) {
      consideredNeighbor = GetGridAtCR(this.tilC-1,this.tilR - 1);
      myNeighbors.push( consideredNeighbor );
    }

    if(this.tilC < TILE_W-1) {
      consideredNeighbor = GetGridAtCR(this.tilC+1,this.tilR);
      myNeighbors.push( consideredNeighbor );
    }

    if(this.tilC < TILE_W-1 && this.tilR < TILE_H-1) {
      consideredNeighbor = GetGridAtCR(this.tilC+1,this.tilR+1);
      myNeighbors.push( consideredNeighbor );
    }

    if(this.tilR > 0) {
      consideredNeighbor = GetGridAtCR(this.tilC,this.tilR-1);
      myNeighbors.push( consideredNeighbor );
      
    }

    if(this.tilR > 0 && this.tilC > 0) {
      consideredNeighbor = GetGridAtCR(this.tilC -1,this.tilR-1);
      myNeighbors.push( consideredNeighbor );
      
    }

    if(this.tilR < TILE_H-1) {
      consideredNeighbor = GetGridAtCR(this.tilC,this.tilR+1);
      myNeighbors.push( consideredNeighbor );
      
    }

    if(this.tilR < TILE_H-1 && this.tilR < TILE_W-1) {
      consideredNeighbor = GetGridAtCR(this.tilC+1,this.tilR+1);
      myNeighbors.push( consideredNeighbor );
    }
    
    return myNeighbors;
  }

  this.isTileType = function(matchType) {
    return (this.elementType==matchType);
  }
    
}//end class declaration