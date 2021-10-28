/**
 * quadtree-js
 * @version 1.2.2
 * @license MIT
 * @author Timo Hausmann
 */

/* https://github.com/timohausmann/quadtree-js.git v1.2.2 */

/*
Copyright © 2012-2020 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

interface Rect {
    x: number,
    y: number,
    width: number,
    height: number,
    data?: any,
}

export default class Quadtree {

    private RID: number;
    private max_objects: number;
    private max_levels: number;
    private level: number;
    private bounds: Rect;
    private objects: Rect[];
    private nodes: Quadtree[];
    private retrieve_cache: { [key: string]: Rect[] };

    /**
     * Quadtree Constructor
     * @param Object bounds            bounds of the node { x, y, width, height }
     * @param Integer max_objects      (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
     * @param Integer max_levels       (optional) total max levels inside root Quadtree (default: 4) 
     * @param Integer level            (optional) deepth level, required for subnodes (default: 0)
     */
    constructor(bounds: Rect, max_objects?: number, max_levels?: number, level?: number) {

        this.max_objects = max_objects || 10;
        this.max_levels = max_levels || 4;

        this.level = level || 0;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = [];
        this.retrieve_cache = {};

        this.RID = 0;
    }


    /**
     * Split the node into 4 subnodes
     */
    split() {

        var nextLevel = this.level + 1,
            subWidth = this.bounds.width / 2,
            subHeight = this.bounds.height / 2,
            x = this.bounds.x,
            y = this.bounds.y;

        //top right node
        this.nodes[0] = new Quadtree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //top left node
        this.nodes[1] = new Quadtree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom left node
        this.nodes[2] = new Quadtree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom right node
        this.nodes[3] = new Quadtree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
    }


    /**
     * Determine which node the object belongs to
     * @param Object pRect      bounds of the area to be checked, with x, y, width, height
     * @return Array            an array of indexes of the intersecting subnodes 
     *                          (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     */
    getIndex(pRect: Rect) {

        var indexes: number[] = [],
            verticalMidpoint = this.bounds.x + (this.bounds.width / 2),
            horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

        var startIsNorth = pRect.y < horizontalMidpoint,
            startIsWest = pRect.x < verticalMidpoint,
            endIsEast = pRect.x + pRect.width > verticalMidpoint,
            endIsSouth = pRect.y + pRect.height > horizontalMidpoint;

        //top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }

        //top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }

        //bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }

        //bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }

        return indexes;
    }


    /**
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param Object pRect        bounds of the object to be added { x, y, width, height }
     */
    insert(pRect: Rect) {

        //set object ID
        if (pRect['_$N_quad_tree_obj_id'] === void 0) {
            pRect['_$N_quad_tree_obj_id'] = ++this.RID;
        }

        var i = 0,
            indexes: number[];

        //if we have subnodes, call insert on matching subnodes
        if (this.nodes.length) {
            indexes = this.getIndex(pRect);

            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(pRect);
            }
            return;
        }

        //otherwise, store object here
        this.objects.push(pRect);

        //max_objects reached
        if (this.objects.length > this.max_objects && this.level < this.max_levels) {

            //split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }

            //add all objects to their corresponding subnode
            for (i = 0; i < this.objects.length; i++) {
                indexes = this.getIndex(this.objects[i]);
                for (var k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }

            //clean up this node
            this.objects.length = 0;
        }
    }


    /**
     * Return all objects that could collide with the given object
     * @param Object pRect      bounds of the object to be checked { x, y, width, height }
     * @Return Array            array with all detected objects
     */
    retrieve(pRect: Rect, returnObjects?: Rect[]) {

        //check cache
        if (returnObjects === void 0) {
            var key = `${pRect.x >> 0}_${pRect.y >> 0}_${pRect.width}_${pRect.height}`;
            returnObjects = this.retrieve_cache[key];
            if (returnObjects) {
                return returnObjects;
            }
            returnObjects = this.retrieve_cache[key] = [];
        }

        //push all objects
        if (this.objects.length > 0) {
            returnObjects.push(...this.objects);
        }

        //if we have subnodes, retrieve their objects
        if (this.nodes.length) {
            var indexes = this.getIndex(pRect);
            for (var i = 0, n = indexes.length; i < n; i++) {
                this.nodes[indexes[i]].retrieve(pRect, returnObjects);
            }
        }

        //remove duplicates
        var obj = {};
        for (var i = returnObjects.length - 1; i >= 0; i--) {
            var id = returnObjects[i]['_$N_quad_tree_obj_id'];
            if (obj[id] !== true) {
                obj[id] = true;
                continue;
            }
            returnObjects.splice(i, 1);
        }

        return returnObjects;
    }


    /**
     * Clear the quadtree
     */
    clear() {
        this.RID = 0;
        this.retrieve_cache = {};
        // objects
        for (var i = 0, n = this.objects.length; i < n; i++) {
            delete this.objects[i]['_$N_quad_tree_obj_id'];
        }
        this.objects.length = 0;
        // nodes
        for (var i = 0, n = this.nodes.length; i < n; i++) {
            this.nodes[i].clear();
        }
        this.nodes.length = 0;
    }

}