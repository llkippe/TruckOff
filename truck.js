class TRUCK {
    constructor(img, gridPos) {
        this.img = img;
        this.img.resize(map.GRID_SIZE, map.GRID_SIZE);

        this.pos = gridPos;

        this.maxAllowedMoves = 4;

        this.directions = ["UP", "LEFT", "DOWN", "RIGHT"];

    }

    draw() {
        let mousePos = map.gridToMousePosition(this.pos);
        
        image(this.img, mousePos.x,mousePos.y);
    }

    moveTruck(path) {
        this.pos = path[path.length-1];
    }

    moveAllowed(pos, direction) {
        if (map.hasRiverAtSide(pos).includes(direction)) return false;
        if (direction === "UP" && map.posOutOfGridSize({x: pos.x, y: pos.y-1})) return false;
        if (direction === "LEFT" && map.posOutOfGridSize({x: pos.x-1, y: pos.y})) return false;
        if (direction === "DOWN" && map.posOutOfGridSize({x: pos.x, y: pos.y+1})) return false;
        if (direction === "RIGHT" && map.posOutOfGridSize({x: pos.x+1, y: pos.y})) return false;
      
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

    findPathsToVenues(startPos) {
        const queue = [];
        const visited = new Set();
        const paths = new Map();
        const venuePaths = new Map();
      
        // Enqueue the starting position with an empty path
        queue.push({ pos: startPos, path: [] });
        visited.add(JSON.stringify(startPos));
      
        while (queue.length > 0) {
            const { pos, path } = queue.shift();
      
            // check maxiumum moves
            if(path.length > this.maxAllowedMoves) continue;

            // Check if the current position is a venue
            if (map.isVenue(pos)) { 
                venuePaths.set(JSON.stringify(pos), path);
            }
            if(!paths.has(JSON.stringify(pos))) {
                paths.set(JSON.stringify(pos), path);
                
            }

            for (const dir of this.directions) {
                const move = this.moveDirection(pos, dir);
                const moveKey = JSON.stringify(move);
                    if (!visited.has(moveKey) && this.moveAllowed(pos, dir)) {
                        visited.add(moveKey);
                        queue.push({ pos: move, path: [...path, move] });
                    }
            }
        
        }

        if(venuePaths.size == 0) return paths;
        else return venuePaths;
    }

    
}