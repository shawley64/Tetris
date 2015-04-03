/**
 * Created by Brenton on 3/23/2015.
 */

TETRIS.objects = (function() {
    'use strict';

    //
    // Piece object
    //
    // Methods:
    //  addBrothers(piece1, piece2, piece3) : adds all linked pieces to this piece
    //  deletePiece() : removes this piece from all linked pieces brothers list
    //  draw(x,y) : draws a texture to the canvas at the location given
    //  getBottomPieces() : returns bottoms list
    //  getBrothers() : returns brothers list
    //  getXLocation() : returns location.x
    //  getYLocation() : returns location.y
    //  init(coords, image) : initializes the piece with empty lists, location, and image
    //  isABottomPiece() : computes if current piece is a bottom piece of shape (list of brothers), will recompute when a rotation or deletion occurs
    //  isALeftPiece() : computes if current piece is a left most piece of shape, will recompute when a rotation or deletion occurs
    //  isARightPiece() : computes if current piece is a right most piece of shape, will recompute when a rotation or deletion occurs
    //  openBelow() : returns true if the space in the grid below the current piece is empty
    //  openLeft() : returns true if the space in the grid to the left of the current piece is empty
    //  openRight() : returns true if the space in the grid to the right of the current piece is empty
    //  removeBrother(piece) : splices the piece out of the current pieces brothers list
    //  setPieceKnowledge() : calls isABottomPiece(), isALeftPiece(), and isARightPiece()
    //  setXLocation(x) : sets location.x to passed in value
    //  setYLocation(y) : sets location.y to passed in value
    //
    function Piece() {
        var that = {},

            brothers = [],
            bottoms = [],

            changeInShapeOccurred = true,
            isBottom = true,
            isLeft = true,
            isRight = true,
            isTop = true,
            isDeleted = false,

            pieceImage = null,
            location = { x : 0, y : 0},

            fatherShape = null;

        that.addBrothers = function(piece1, piece2, piece3) {
            brothers.push(piece1);
            brothers.push(piece2);
            brothers.push(piece3);
        };

        that.clearBrothers = function() {
            brothers.length = 0;
        };

        that.deletePiece = function() {
            var i = 0,
                length = brothers.length;

            for(i = 0; i < length; ++i) {
                brothers[i].removeBrother(this);
                brothers[i].setPieceKnowledge();
            }

            isDeleted = true;
        };

        that.draw = function(x,y) {
            TETRIS.graphics.Texture({
                image : pieceImage,
                center : { x : 35 * x + 17.5 + 75, y : 35 * y + 67.5 - 70 /* -70 because of the invisible top two rows */ },
                width : 35, height : 35
            }).draw();
        };

        that.getBottomPieces = function() {
            return bottoms;
        };

        that.getBrothers = function() {
            return brothers;
        };

        that.getFatherShape = function() {
            return fatherShape;
        };

        that.getIsBottom = function() {
            return isBottom;
        };

        that.getIsLeft = function() {
            return isLeft;
        };

        that.getIsRight = function() {
            return isRight;
        };

        that.getIsTop = function() {
            return isTop;
        };

        that.getXLocation = function() {
            return location.x;
        };

        that.getYLocation = function() {
            return location.y;
        };

        that.hasChanged = function() {
            that.setPieceKnowledge();
        };

        that.init = function(coords, image, father) {
            location.x = coords.x;
            location.y = coords.y;
            pieceImage = image;

            changeInShapeOccurred = true;   // Initially this will be true
            isBottom = true;
            isLeft = true;
            isRight = true;
            isTop = true;

            brothers.length = 0;
            bottoms.length = 0;

            fatherShape = father;

            TETRIS.grid.placePiece(this);
        };

        that.isABrotherLocation = function(x,y) {
            var i = 0,
                length = brothers.length;

            for (var i = 0; i < length; ++i) {
                if(x === brothers[i].getXLocation() && y === brothers[i].getYLocation()) {
                    return true;
                }
            }
            return false;
        };

        that.isABottomPiece = function() {
            var i = 0,
                length = brothers.length;

            isBottom = true;

            if(length === 0) {         // If I'm the only piece, I am a bottom
                return isBottom;
            }

           // We only want to run through this loop if the shape has changed, otherwise it's the same. Change occurs on rotation or deletion of piece
            for (i = 0; i < length; ++i) {
                if (location.x === brothers[i].getXLocation()) {
                    if (location.y < brothers[i].getYLocation()) {
                        isBottom = false;
                        return false;
                    }
                }
            }
        };

        that.isALeftPiece = function() {
            var i = 0,
                length = brothers.length;

            isLeft = true;

            if(length === 0) {         // If I'm the only piece, I am the left most piece
                return isLeft;
            }

            for(i = 0; i < length; ++i) {
                if (location.y === brothers[i].getYLocation()) {
                    if (location.x > brothers[i].getXLocation()) {
                        isLeft = false;
                        return false;
                    }
                }
            }
        };

        that.isARightPiece = function() {
            var i = 0,
                length = brothers.length;

            isRight = true;

            if(length === 0) {
                return isRight;
            }

            for(i = 0; i < length; ++i) {
                if(location.y === brothers[i].getYLocation()) {
                    if(location.x < brothers[i].getXLocation()) {
                        isRight = false;
                        return false;
                    }
                }
            }
        };

        that.isATopPiece = function() {
            var i = 0,
                length = brothers.length;

            isTop = true;

            if(length === 0) {
                return isTop;
            }
            for(i = 0; i < length; ++i) {
                if(location.x === brothers[i].getXLocation()) {
                    if(location.y > brothers[i].getYLocation()) {
                        isTop = false;
                        return false;
                    }
                }
            }
        };

        that.isDeleted = function() {
            return isDeleted;
        };

        that.openBelow = function() {
            return (TETRIS.grid.isEmpty(location.x, location.y + 1));
        };

        that.openLeft = function() {
            return (TETRIS.grid.isEmpty(location.x - 1, location.y));
        };

        that.openRight = function() {
            return (TETRIS.grid.isEmpty(location.x + 1, location.y));
        };

        that.printDetails = function() {
            console.log('X: ' + location.x);
            console.log('Y: ' + location.y);
            console.log('Is a Top Piece: ' + isTop);
            console.log('Is a Right Piece: ' + isRight);
            console.log('Is a Bottom Piece: ' + isBottom);
            console.log('Is a Left Piece: ' + isLeft);
            console.log('\n');
        };

        that.removeBrother = function(piece) {
            var index = brothers.indexOf(piece);
            if (index > -1) {
                brothers.splice(index, 1);
            }
        };

        that.setPieceKnowledge = function() {
            that.isABottomPiece();
            that.isARightPiece();
            that.isALeftPiece();
            that.isATopPiece();
            changeInShapeOccurred = false;
        };

        that.setXLocation = function(x) {
            location.x = x;
        };

        that.setYLocation = function(y) {
            location.y = y;
        };
        
        return that;
    }


    //
    // Grid object
    //
    // Methods:
    //  INTERNAL withinBounds(x,y) : returns true if the x and y value are within the bounds of the 2D array
    //  clear() : calls init to clear the array back to null values
    //  draw() : draws each piece in the grid
    //  init() : sets up the array with all null values to full size of 10x20
    //  isEmpty(x,y) : returns true if the point (x,y) are within bounds and contains only null
    //  movePieceDown(piece) : moves all pieces related to this piece down until they cannot go anymore
    //  moveShapeDown(shape) : for each piece in the shape, sets current location to null and next location to current piece, updates pieces location
    //  moveShapeLeft(shape) : for each piece in the shape, sets current location to null and next location to current piece, updates pieces location
    //  moveShapeRight(shape) : for each piece in the shape, sets current location to null and next location to current piece, updates pieces location
    //
    function Grid() {
        var that = {},
            grid = [[]],

            withinBounds = function(x,y) {
                if(x >= 0 && x < 10) {
                    if(y >= 0 && y < 22) {
                        return true;
                    }
                }
                return false;
            };

        that.checkForFullRows = function() {
            var y = 21,
                x = 0,
                isFull = true,
                allEmpty = false,
                rowDeleted = false,
                listOfRowIndex = [];

            for(y = 21; y >= 0; y--) {
                isFull = true;
                allEmpty = false;

                for(x = 0; x < 10; x++) {
                    if(TETRIS.grid.isEmpty(x, y)) {             // This row contains an empty cell, we don't care about it anymore
                        isFull = false;                         // If this row has an empty spot, it is not full
                    }
                    else {
                        allEmpty = false;                       // If this row has a single piece in it, it is not all empty
                    }
                }

                if(allEmpty) {                                  // If all columns are empty in the row then there will be nothing above, just stop there
                    break;
                }

                if(isFull) {                                    // If the row if full, I need to work on it.
                    listOfRowIndex.push(y);                     // I want to push the index of the row to change
                }
            }
            if(listOfRowIndex.length > 0) {
                TETRIS.grid.deleteRows(listOfRowIndex);
            }
        };

        that.clearGrid = function() {
            that.init();
        };

        that.deleteRows = function(listOfFullIndex) {
            var lengthOfList = listOfFullIndex.length,
                index = 0,
                x = 0,
                y = 0,
                row = null,
                currentShape = null,
                pieces = null,
                piece = null,
                pIndex = 0;

            console.log(listOfFullIndex.length);

            for(index = 0; index < lengthOfList; ++index) {         // For each index in the list, we need the y out of it
                y = listOfFullIndex[index];                         // Get the y coord of the row we are working on

                for(x = 0; x < 10; ++x) {

                    currentShape = grid[x][y].getFatherShape();     // Get the shape this piece belongs to
                    grid[x][y].deletePiece();                       // Delete the piece (marks it as deleted and removes it from all of its brothers lists of brother pieces
                    pieces = currentShape.getPieces();              // Get all of the pieces of the shape

                    for(pIndex = 0; pIndex < 4; ++pIndex) {
                        pieces[pIndex].setPieceKnowledge();         // Reset the piece knowledge of the remaining pieces
                    }
                }
            }

            TETRIS.grid.makeGridFall();                              // Now we need to move all pieces down to fill in the empty space
        };

        that.draw = function() {
            var i = 0,
                j = 0,
                rows = 22,
                columns = 10;

            for(i = 0; i < columns; ++i) {
                for(j = 2; j < rows; ++j) {
                    if(grid[i][j] !== null && !(grid[i][j].isDeleted())) {
                        grid[i][j].draw(i, j);
                    }
                }
            }
        };

        that.init = function() {
            var i = 0,
                j = 0,
                rows = 22,
                columns = 10;

            for(i = 0; i < columns; ++i) {
                if (!grid[i]) grid[i] = [];
                for(j = 0; j < rows; ++j) {
                    grid[i][j] = null;
                }
            }
        };

        that.isEmpty = function(x, y) {
            if(withinBounds(x, y)) {
                if(grid[x][y] === null || grid[x][y].isDeleted()) {
                    return true;
                }
            }
            return false;
        };

        that.makeGridFall = function() {
            var y = 21,
                x = 0,
                i = 0,
                currentShape = null,
                pieces = null;

            for(y = 21; y >= 0; --y) {
                for(x = 0; x < 10; ++x) {
                    if(!TETRIS.grid.isEmpty(x,y)) {                         // If there is a piece in this cell, try to move it down
                        currentShape = grid[x][y].getFatherShape();

                        pieces = currentShape.getPieces();
                        for(i = 0; i < 4; ++i) {
                            while(TETRIS.grid.movePieceDown(pieces[i])) {}   // Move piece down until it can't go any further
                        }

                    }
                }
            }
        };

        that.movePieceDown = function(piece) {
            var allClear = true,
                brothers = piece.getBrothers(),
                currentPiece = null,
                pieceMoved = false,
                length = 0,
                i = 0,
                x = 0,
                y = 0;

            brothers.push(piece);    // When we grab piece.getBrothers(), it will only grab pieces brothers, we want all of them including the one calling it
            length = brothers.length;

            while(allClear) {
                for (i = 0; i < length; ++i) {
                    if (brothers[i].getIsBottom() && !(brothers[i].openBelow())) {
                        allClear = false;
                    }
                }

                if (allClear) {
                    for (i = 0; i < length; ++i) {
                        currentPiece = brothers[i];
                        x = currentPiece.getXLocation();
                        y = currentPiece.getYLocation();
                        grid[x][y] = null;
                        grid[x][y + 1] = currentPiece;
                        currentPiece.setYLocation(y + 1);
                        pieceMoved = true;
                    }
                }
            }
            return pieceMoved;
        };

        that.moveShapeDown = function(shape) {
            var currentPiece = null,
                pieces = shape.getPieces(),
                length = pieces.length,
                i = 0,
                x = 0,
                y = 0;

            for(i = 0; i < length; ++i) {
                currentPiece = pieces[i];
                x = currentPiece.getXLocation();
                y = currentPiece.getYLocation();
                grid[x][y+1] = currentPiece;
                currentPiece.setYLocation(y+1);

                if(currentPiece.getIsTop()) {
                    grid[x][y] = null;
                }
            }
        };

        that.moveShapeLeft = function(shape) {
            var currentPiece = null,
                pieces = shape.getPieces(),
                length = pieces.length,
                i = 0,
                x = 0,
                y = 0;

            for(i = 0; i < length; ++i) {
                currentPiece = pieces[i];
                x = currentPiece.getXLocation();
                y = currentPiece.getYLocation();
                grid[x-1][y] = currentPiece;
                currentPiece.setXLocation(x-1);

                if(currentPiece.getIsRight()) {
                    grid[x][y] = null;
                }
            }
        };

        that.moveShapeRight = function(shape) {
            var currentPiece = null,
                pieces = shape.getPieces(),
                length = pieces.length,
                i = 0,
                x = 0,
                y = 0;

            for(i = 0; i < length; ++i) {
                currentPiece = pieces[i];
                x = currentPiece.getXLocation();
                y = currentPiece.getYLocation();
                grid[x+1][y] = currentPiece;
                currentPiece.setXLocation(x+1);

                if(currentPiece.getIsLeft()) {
                    grid[x][y] = null;
                }
            }
        };

        that.moveShapeTo = function(pieces, locations) {
            var currentPiece = null,
                length = pieces.length,
                i = 0,
                x = 0,
                y = 0;

            for(i = 0; i < length; ++i) {       // Erase old piece locations if they've changed
                if(pieces[i].hasChanged) {
                    currentPiece = pieces[i].piece;
                    x = currentPiece.getXLocation();
                    y = currentPiece.getYLocation();
                    grid[x][y] = null;
                }
            }

            for(i = 0; i < length; ++i) {       // Set new piece locations if they've changed
                if (pieces[i].hasChanged) {
                    currentPiece = pieces[i].piece;
                    currentPiece.setXLocation(locations[i].x);
                    currentPiece.setYLocation(locations[i].y);
                    grid[locations[i].x][locations[i].y] = currentPiece;
                }
            }


            for(i = 0; i < length; ++i) {
                currentPiece = pieces[i].piece;
                currentPiece.clearBrothers();   // We need to reset each pieces brother list

                switch(i) {
                    case 0:
                        currentPiece.addBrothers(pieces[1].piece, pieces[2].piece, pieces[3].piece);
                        break;
                    case 1:
                        currentPiece.addBrothers(pieces[0].piece, pieces[2].piece, pieces[3].piece);
                        break;
                    case 2:
                        currentPiece.addBrothers(pieces[0].piece, pieces[1].piece, pieces[3].piece);
                        break;
                    case 3:
                        currentPiece.addBrothers(pieces[0].piece, pieces[1].piece, pieces[2].piece);
                        break;
                }

                currentPiece.hasChanged();

                //console.log('Piece ' + i);
                //currentPiece.printDetails();
            }
        };

        that.placePiece = function(piece) {
            var x = piece.getXLocation(),
                y = piece.getYLocation();

            if(that.isEmpty(x,y)) {
                grid[x][y] = piece;
            }
            else {
                console.log('adding a piece where grid is not empty');
            }
        };

        return that;
    }


    //
    // Shape object
    //  (s) : the string notation of the shape
    //
    // Methods:
    //  canSpawn() : checks if each spawn point needed by the shape is empty
    //  fall()  : checks all locations below all bottom pieces of the shape, if all clear, moves the shape down. returns true if move is successful
    //  getPieces() : returns all pieces within the shape
    //  hardDrop() : calls fall until fall returns false, then returns true
    //  moveLeft() : checks all locations to the left of all left side pieces of the shape, if all clear, moves the shape left. returns true if move is successful
    //  moveRight() : checks all locations to the right of all right side pieces of the shape, if all clear, moves the shape right, returns true if move is successful
    //  rotateLeft() : attempts to perform a rotation 90 degrees to the left, returns true if successful
    //  rotateRight() : attempts to perform a rotation 90 degrees to the right, returns true if successful
    //  spawn() : sets up each piece of the shape with coordinates corresponding to the string notation, sets up each pieces brother list, sets up each pieces left/right/bottom knowledge
    //
    function Shape(s) {
        var that = {};

        var pieces = [],
            rotationState = 0,
            shape = s,

            attemptRotation = function(offsets) {
                var clearToRotate = true,
                    newLocations = [],
                    pieceAndChanged = [],
                    i = 0;

                newLocations.length = 0;
                pieceAndChanged.length = 0;

                newLocations.push({x: pieces[0].getXLocation() + offsets.p0.x, y: pieces[0].getYLocation() + offsets.p0.y });
                newLocations.push({x: pieces[1].getXLocation() + offsets.p1.x, y: pieces[1].getYLocation() + offsets.p1.y });
                newLocations.push({x: pieces[2].getXLocation() + offsets.p2.x, y: pieces[2].getYLocation() + offsets.p2.y });
                newLocations.push({x: pieces[3].getXLocation() + offsets.p3.x, y: pieces[3].getYLocation() + offsets.p3.y });

                for (i = 0; i < 4; ++i) {
                    pieceAndChanged.push({ piece : pieces[i], hasChanged : (newLocations[i].x !== pieces[i].getXLocation() || newLocations[i].y !== pieces[i].getYLocation()) });
                }

                for (i = 0; i < 4; ++i) {
                    if (pieceAndChanged[i].hasChanged && !(TETRIS.grid.isEmpty(newLocations[i].x, newLocations[i].y))) {        // If the piece's location has changed and the new location is NOT empty
                        if(!(pieceAndChanged[i].piece.isABrotherLocation(newLocations[i].x, newLocations[i].y))) {              // If the new location doesn't contain a brother piece
                            clearToRotate = false;
                        }
                    }
                }

                if (clearToRotate) {
                    TETRIS.grid.moveShapeTo(pieceAndChanged, newLocations);
                }
                return clearToRotate;
            };

        that.canSpawn = function() {
            switch(shape) {
                case 'B':
                    return (TETRIS.grid.isEmpty(4,0) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(5,0) && TETRIS.grid.isEmpty(5,1));
                case 'LL':
                    return (TETRIS.grid.isEmpty(3,0) && TETRIS.grid.isEmpty(3,1) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(5,1));
                case 'RL':
                    return (TETRIS.grid.isEmpty(3,1) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(5,1) && TETRIS.grid.isEmpty(5,0));
                case 'LZ':
                    return (TETRIS.grid.isEmpty(3,0) && TETRIS.grid.isEmpty(4,0) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(5,1));
                case 'RZ':
                    return (TETRIS.grid.isEmpty(3,1) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(4,0) && TETRIS.grid.isEmpty(5,0));
                case 'T':
                    return (TETRIS.grid.isEmpty(4,0) && TETRIS.grid.isEmpty(3,1) && TETRIS.grid.isEmpty(4,1) && TETRIS.grid.isEmpty(5,1));
                case 'I':
                    return (TETRIS.grid.isEmpty(3,0) && TETRIS.grid.isEmpty(4,0) && TETRIS.grid.isEmpty(5,0) && TETRIS.grid.isEmpty(6,0));
                default:
                    console.log('Shape is not registered: canSpawn');
            }
            return false;
        };

        that.fall = function() {
            var i = 0,
                allClear = true;

            for(i = 0; i < 4; ++i) {
                if(pieces[i].getIsBottom() && !(pieces[i].openBelow())) {     // It IS a bottom piece, but below is not open
                    allClear = false;
                }
            }

            if(allClear) {
                TETRIS.grid.moveShapeDown(this);
                return true;
            } else {
                return false;
            }
        };

        that.getPieces = function() {
            return pieces;
        };

        that.hardDrop = function() {
            var dropping = true;

            while(dropping) {
                dropping = that.fall();
            }
            return true;
        };

        that.moveLeft = function() {
            var i = 0,
                allClear = true;

            for(i = 0; i < 4; ++i) {
                if(pieces[i].getIsLeft() && !(pieces[i].openLeft())) {       // It IS a left piece, but left is not open
                    allClear = false;
                }
            }

            if(allClear) {
                TETRIS.grid.moveShapeLeft(this);
            }
        };

        that.moveRight = function() {
            var i = 0,
                allClear = true;

            for(i = 0; i < 4; ++i) {
                if(pieces[i].getIsRight() && !(pieces[i].openRight())) {
                    allClear = false;
                }
            }

            if(allClear) {
                TETRIS.grid.moveShapeRight(this);
            }
        };

        that.rotate = function(dir) {
            var toState = 0,
                stateCoordsA = null,
                stateCoordsB = null,
                stateCoordsC = null,
                stateCoordsD = null,
                useCoords = null;

            switch(shape) {
                case 'B':
                    return; // Box's don't need to rotate
                case 'LL':
                    stateCoordsA = {
                        p0 : { x : 0, y : -2 },
                        p1 : { x : -1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : 1 }
                    };
                    stateCoordsB = {
                        p0 : { x : 2, y : 0 },
                        p1 : { x : 1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : 1 }
                    };
                    stateCoordsC = {
                        p0 : { x : 0, y : 2 },
                        p1 : { x : 1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : -1 }
                    };
                    stateCoordsD = {
                        p0 : { x : -2, y : 0 },
                        p1 : { x : -1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : -1 }
                    };
                    break;
                case 'RL':
                    stateCoordsA = {
                        p0 : { x : -1, y : -1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : 1, y : 1 },
                        p3 : { x : 2, y : 0 }
                    };
                    stateCoordsB = {
                        p0 : { x : 1, y : -1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : -1, y : 1 },
                        p3 : { x : 0, y : 2 }
                    };
                    stateCoordsC = {
                        p0 : { x : 1, y : 1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : -1, y : -1 },
                        p3 : { x : -2, y : 0 }
                    };
                    stateCoordsD = {
                        p0 : { x : -1, y : 1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : 1, y : -1 },
                        p3 : { x : 0, y : -2 }
                    };
                    break;
                case 'LZ':
                    stateCoordsA = {
                        p0 : { x : 0, y : -2 },
                        p1 : { x : 1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : 1 }
                    };
                    stateCoordsB = {
                        p0 : { x : 2, y : 0 },
                        p1 : { x : 1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : 1 }
                    };
                    stateCoordsC = {
                        p0 : { x : 0, y : 2 },
                        p1 : { x : -1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : -1 }
                    };
                    stateCoordsD = {
                        p0 : { x : -2, y : 0 },
                        p1 : { x : -1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : -1 }
                    };
                    break;
                case 'RZ':
                    stateCoordsA = {
                        p0 : { x : -1, y : -1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : 1, y : -1 },
                        p3 : { x : 2, y : 0 }
                    };
                    stateCoordsB = {
                        p0 : { x : 1, y : -1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : 1, y : 1 },
                        p3 : { x : 0, y : 2 }
                    };
                    stateCoordsC = {
                        p0 : { x : 1, y : 1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : -1, y : 1 },
                        p3 : { x : -2, y : 0 }
                    };
                    stateCoordsD = {
                        p0 : { x : -1, y : 1 },
                        p1 : { x : 0, y : 0 },
                        p2 : { x : -1, y : -1 },
                        p3 : { x : 0, y : -2 }
                    };
                    break;
                case 'T':
                    stateCoordsA = {
                        p0 : { x : 1, y : -1 },
                        p1 : { x : -1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : 1 }
                    };
                    stateCoordsB = {
                        p0 : { x : 1, y : 1 },
                        p1 : { x : 1, y : -1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : 1 }
                    };
                    stateCoordsC = {
                        p0 : { x : -1, y : 1 },
                        p1 : { x : 1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : -1, y : -1 }
                    };
                    stateCoordsD = {
                        p0 : { x : -1, y : -1 },
                        p1 : { x : -1, y : 1 },
                        p2 : { x : 0, y : 0 },
                        p3 : { x : 1, y : -1 }
                    };
                    break;
                case 'I':
                    stateCoordsA = {
                        p0 : { x : -1, y : -2 },
                        p1 : { x : 0, y : -1 },
                        p2 : { x : 1, y : 0 },
                        p3 : { x : 2, y : 1 }
                    };
                    stateCoordsB = {
                        p0 : { x : 2, y : -1 },
                        p1 : { x : 1, y : 0 },
                        p2 : { x : 0, y : 1 },
                        p3 : { x : -1, y : 2 }
                    };
                    stateCoordsC = {
                        p0 : { x : 1, y : 2 },
                        p1 : { x : 0, y : 1 },
                        p2 : { x : -1, y : 0 },
                        p3 : { x : -2, y : -1 }
                    };
                    stateCoordsD = {
                        p0 : { x : -2, y : 1 },
                        p1 : { x : -1, y : 0 },
                        p2 : { x : 0, y : -1 },
                        p3 : { x : 1, y : -2 }
                    };
                    break;
                default:
                    console.log('Shape is not registered: Rotate');
                    break;
            }

            if(dir == 'r') {
                toState = (rotationState < 3) ? rotationState + 1 : 0;
            }
            else {
                toState = (rotationState > 0) ? rotationState - 1 : 3;
            }

            switch(toState) {
                case 0:
                    if(dir == 'r') {
                        useCoords = stateCoordsA;
                    } else {
                        useCoords = stateCoordsD;
                    }
                    break;
                case 1:
                    if(dir == 'r') {
                        useCoords = stateCoordsB;
                    } else {
                        useCoords = stateCoordsA;
                    }
                    break;
                case 2:
                    if(dir == 'r') {
                        useCoords = stateCoordsC;
                    } else {
                        useCoords = stateCoordsB;
                    }
                    break;
                case 3:
                    if(dir == 'r') {
                        useCoords = stateCoordsD;
                    } else {
                        useCoords = stateCoordsC;
                    }
                    break;
            }

            if(attemptRotation(useCoords)) {            // This actually performs the rotation
                rotationState = toState;
            }
        };

        that.spawn = function() {
            var piece1 = Piece(),
                piece2 = Piece(),
                piece3 = Piece(),
                piece4 = Piece();

            pieces.push(piece1);
            pieces.push(piece2);
            pieces.push(piece3);
            pieces.push(piece4);

            switch(shape) {
                case 'B':
                    pieces[0].init({ x : 4, y : 0 }, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[1].init({ x : 5, y : 0 }, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[2].init({ x : 4, y : 1 }, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[3].init({ x : 5, y : 1 }, TETRIS.images['images/squares/green_square.png'], this);
                    break;
                case 'LL':
                    pieces[0].init({ x : 3, y : 0 }, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[1].init({ x : 3, y : 1 }, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[2].init({ x : 4, y : 1 }, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[3].init({ x : 5, y : 1 }, TETRIS.images['images/squares/blue_square.png'], this);
                    break;
                case 'RL':
                    pieces[0].init({ x : 3, y : 1 }, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[1].init({ x : 4, y : 1 }, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[2].init({ x : 5, y : 1 }, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[3].init({ x : 5, y : 0 }, TETRIS.images['images/squares/light_blue_square.png'], this);
                    break;
                case 'LZ':
                    pieces[0].init({ x : 3, y : 0 }, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[1].init({ x : 4, y : 0 }, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[2].init({ x : 4, y : 1 }, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[3].init({ x : 5, y : 1 }, TETRIS.images['images/squares/orange_square.png'], this);
                    break;
                case 'RZ':
                    pieces[0].init({ x : 3, y : 1 }, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[1].init({ x : 4, y : 1 }, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[2].init({ x : 4, y : 0 }, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[3].init({ x : 5, y : 0 }, TETRIS.images['images/squares/gray_square.png'], this);
                    break;
                case 'T':
                    pieces[0].init({ x : 4, y : 0 }, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[1].init({ x : 3, y : 1 }, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[2].init({ x : 4, y : 1 }, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[3].init({ x : 5, y : 1 }, TETRIS.images['images/squares/brown_square.png'], this);
                    break;
                case 'I':
                    pieces[0].init({ x : 3, y : 0 }, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[1].init({ x : 4, y : 0 }, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[2].init({ x : 5, y : 0 }, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[3].init({ x : 6, y : 0 }, TETRIS.images['images/squares/navy_square.png'], this);
                    break;
                default:
                    console.log('Shape is not registered: Spawn');
            }

            pieces[0].addBrothers(pieces[1], pieces[2], pieces[3]);
            pieces[1].addBrothers(pieces[0], pieces[2], pieces[3]);
            pieces[2].addBrothers(pieces[0], pieces[1], pieces[3]);
            pieces[3].addBrothers(pieces[0], pieces[1], pieces[2]);

            pieces[0].setPieceKnowledge();
            pieces[1].setPieceKnowledge();
            pieces[2].setPieceKnowledge();
            pieces[3].setPieceKnowledge();
        };

        return that;
    }

    return {
        Piece : Piece,
        Grid : Grid,
        Shape : Shape
    };
}());