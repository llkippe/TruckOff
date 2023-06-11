class TRUCK {
    constructor(img, gridPos) {
        this.img = img;
        this.img.resize(map.GRID_SIZE, map.GRID_SIZE);

        this.pos = gridPos;

        this.maxAllowedMoves = 5;

        this.directions = ["UP", "LEFT", "DOWN", "RIGHT"];

    }

    draw() {
        let mousePos = map.gridToMousePosition(this.pos);
        
        image(this.img, mousePos.x,mousePos.y);
    }

    moveAllowed(pos, direction) {
        console.log(pos, direction);
      
        if (map.hasRiverAtSide(pos).includes(direction)) return false;
        // console.log("river")
        if (direction === "UP" && map.posOutOfGridSize({x: pos.x, y: pos.y-1})) return false;
        // console.log("up")
        if (direction === "LEFT" && map.posOutOfGridSize({x: pos.x-1, y: pos.y})) return false;
        // console.log("left")
        if (direction === "DOWN" && map.posOutOfGridSize({x: pos.x, y: pos.y+1})) return false;
        // console.log("down")
        if (direction === "RIGHT" && map.posOutOfGridSize({x: pos.x+1, y: pos.y})) return false;
        // console.log("right")
      
        return true;
      }
      
      moveDirection(pos, direction) {
        let newPos = { ...pos }; // Create a shallow copy of pos
      
        if (direction === "UP") newPos.y -= 1;
        if (direction === "LEFT") newPos.x -= 1;
        if (direction === "DOWN") newPos.y += 1;
        if (direction === "RIGHT") newPos.x += 1;
      
        return newPos;
      }
      
      getLegalRoutes(currentRoute, timesMoved, legalRoutes) {
        timesMoved++;
      
        if (timesMoved === this.maxAllowedMoves) {
          legalRoutes.push([...currentRoute]);
          console.log(timesMoved + " pushed route" + JSON.stringify(currentRoute));
          return legalRoutes;
        } else {
          for (let i = 0; i < 4; i++) {
            if (this.moveAllowed(currentRoute[currentRoute.length - 1], this.directions[i])) {
              
              let newPos = this.moveDirection(currentRoute[currentRoute.length - 1], this.directions[i]);
              if (!currentRoute.some(route => route.x == newPos.x && route.y == newPos.y)) {
                console.log(this.directions[i]);
                currentRoute.push(newPos);
                
                console.log("new ROute" + JSON.stringify(currentRoute));
                this.getLegalRoutes(currentRoute, timesMoved, legalRoutes);
                currentRoute.pop(); // Remove the last move from the current route
                timesMoved--;
              }
            }else{
                console.log(this.directions[i] + " not allowed pos:"+ currentRoute[currentRoute.length - 1].x + currentRoute[currentRoute.length - 1].y);
            }
          }
        }
      
        console.log(legalRoutes);
      
        timesMoved--;
        currentRoute.pop(); // Remove the last move from the current route
      
        return legalRoutes;
      }
      
      



}