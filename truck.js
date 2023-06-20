class TRUCK {
    constructor(img, gridPos) {
        this.img = img;
        this.img.resize(map.GRID_SIZE, map.GRID_SIZE);

        this.pos = gridPos;
        this.maxAllowedMoves = 4;
        this.directions = ["UP", "LEFT", "DOWN", "RIGHT"];

        this.animation = null;
        this.animPath = null;
        this.lastSegmentIndex = 0;

    }

    draw() {
        let mousePos = this.getAnimatedTruckPos();
        if (mousePos) {
            stroke(0)
            strokeWeight(5);
            line(mousePos.x + map.GRID_SIZE / 2, mousePos.y + map.GRID_SIZE / 2, mousePos.fromPosX + map.GRID_SIZE / 2, mousePos.fromPosY + map.GRID_SIZE / 2);
        }

        if (mousePos == null) mousePos = map.gridToMousePosition(this.pos);

        image(this.img, mousePos.x, mousePos.y);
    }

    getAnimatedTruckPos() {
        if (this.animPath && this.animation) {
            let animT = this.animation.getAnimationTime();

            const segmentCount = this.animPath.length - 1; // Number of segments in the path
            const segmentIndex = Math.floor(animT * segmentCount); // Index of the current segment

            if (animT < 1) {


                if (this.lastSegmentIndex != segmentIndex) { // update truck lines on map
                    const fromPos = map.gridToMousePosition(this.animPath[this.lastSegmentIndex]);
                    const toPos = map.gridToMousePosition(this.animPath[segmentIndex]);
                    map.truckLines.push({ fromPos, toPos });

                    this.lastSegmentIndex = segmentIndex
                }
                const t = animT * segmentCount - segmentIndex; // Interpolation factor within the current segment

                const pos0 = map.gridToMousePosition(this.animPath[segmentIndex]);
                const pos1 = map.gridToMousePosition(this.animPath[segmentIndex + 1]);

                // Perform linear interpolation between pos0 and pos1 using t
                const x = lerp(pos0.x, pos1.x, t);
                const y = lerp(pos0.y, pos1.y, t);

                return { x, y, fromPosX: pos0.x, fromPosY: pos0.y };
            } else {
                routeTracker.routeTrackingInit(map.getVenueType(this.pos));

                const fromPos = map.gridToMousePosition(this.animPath[this.lastSegmentIndex]);
                const toPos = map.gridToMousePosition(this.animPath[segmentIndex]);
                map.truckLines.push({ fromPos, toPos });

                for (let i = 0; i < this.animPath.length; i++) {
                    map.closeVenue(this.animPath[i]);
                }

                this.animPath = null;
                this.animation = null;


                this.lastSegmentIndex = 0;

            }
        }

        return null;
    }



    moveTruck(path) {
        this.animPath = path;
        this.animPath.unshift(this.pos);
        this.animation = new ANIMATION(3 * ANIMATION_TIME, 0, "easeInOutSin");


        this.pos = path[path.length - 1];
    }

    moveAllowed(pos, direction) {
        if (map.hasRiverAtSide(pos).includes(direction)) return false;

        if (direction === "UP" && map.posOutOfGridSize({ x: pos.x, y: pos.y - 1 })) return false;
        if (direction === "LEFT" && map.posOutOfGridSize({ x: pos.x - 1, y: pos.y })) return false;
        if (direction === "DOWN" && map.posOutOfGridSize({ x: pos.x, y: pos.y + 1 })) return false;
        if (direction === "RIGHT" && map.posOutOfGridSize({ x: pos.x + 1, y: pos.y })) return false;

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
    /*
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
                if (path.length > this.maxAllowedMoves) continue;
    
                // Check if the current position is a venue
                if (map.isActiveVenue(pos)) {
                    // wenn path nicht in venue path dann hinzufuegen
                    if(!(this.isPathOverActiveVenue(path) && venuePaths.has(JSON.stringify(pos)))) {
                        venuePaths.set(JSON.stringify(pos), path);
                    }
                   
                }
    
                console.log(pos, venuePaths);
                if (!paths.has(JSON.stringify(pos))) {
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
    
            venuePaths.delete(JSON.stringify(this.pos));
            paths.delete(JSON.stringify(this.pos));
    
    
    
            if (venuePaths.size == 0) return paths;
            else return venuePaths;
        }
    */
    findPathsToVenues(startPos) {
        const queue = [];
        const paths = new Map();
        const venuePaths = new Map();

        // Enqueue the starting position with an empty path
        queue.push({ pos: startPos, path: [] });

        while (queue.length > 0) {
            const { pos, path } = queue.shift();

            // check maxiumum moves
            if (path.length > this.maxAllowedMoves) continue;

            // Check if the current position is a venue
            if (map.isVenue(pos)) {
                //if(pos.x == 3 && pos.y == 2) 
                //console.log(path);
                if (venuePaths.has(JSON.stringify(pos))) { // evalute which path is better (look for shoter venuePaths)
                    const prevPath = venuePaths.get(JSON.stringify(pos));
                    if (this.isPathOverActiveVenue(prevPath)) {
                        if (this.isPathOverActiveVenue(path)) { // chose shorter path if both over active venue
                            if (path.length < prevPath.length) venuePaths.set(JSON.stringify(pos), path);
                        } else {
                            venuePaths.set(JSON.stringify(pos), path);
                        }
                    }
                } else {
                    venuePaths.set(JSON.stringify(pos), path);
                }
            }

            if (!paths.has(JSON.stringify(pos))) {
                paths.set(JSON.stringify(pos), path);
            }

            for (const dir of this.directions) {
                const move = this.moveDirection(pos, dir);
                const moveKey = JSON.stringify(move);

                // Check if the move is allowed
                if (!this.moveAllowed(pos, dir)) continue;

                const newPath = [...path, move];
                queue.push({ pos: move, path: newPath });
            }
        }

        venuePaths.delete(JSON.stringify(this.pos));
        paths.delete(JSON.stringify(this.pos));


        if (venuePaths.size == 0) return paths;
        else return venuePaths;
    }


    isPathOverActiveVenue(path) {
        for (let i = 0; i < path.length - 1; i++) {
            if (map.isActiveVenue(path[i])) return true;
        }
        return false;
    }

}