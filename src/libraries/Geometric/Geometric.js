/**
 * Few helpers for geometric operations.
 * 
 * @module Geometric/Geometric
 * 
 * @author  Arkadiusz Krauzowicz
 * @version 0.0.1
 */

/**
 * Simplest geometric object.
 */
export class Point {
    /**
     * Create Point from coordinates.
     * @param {number} x Horizontal coordinate.
     * @param {number} y Vertical coordinate.
     */
    constructor( x, y ) {
        this.x = x
        this.y = y
        return this
    }
}

/**
 * Infinity line made with two Points.
 * 
 * @method length Get line length.
 */
export class Line {
    /**
     * Create Line from two Points.
     * 
     * @param {Point} startPoint Starting point.
     * @param {Point} endPoint   Ending point.
     */
    constructor( startPoint, endPoint ) {
        if ( ! startPoint instanceof Point && ! endPoint instanceof Point ) {
            throw new TypeError( `Line properties must be Points.` )
            return false
        }
        if ( startPoint.x === endPoint.x && startPoint.y === endPoint.y ) {
            throw new TypeError( `Infinite possibilities. Line can be declared only by two different Points.` )
            return false
        }
        this.startPoint = startPoint
        this.endPoint = endPoint
        return this
    }

    /**
     * Get Linear Function Object from the Line.
     * 
     * @returns {LinearFunction} Linear function describing the Line.
     */
    getLinearFunction() {
        const p1 = this.startPoint
        const p2 = this.endPoint

        if ( p1.x === p2.x ) {
            return new VerticalFunction( p1.x )
        }
        let a = ( p2.y - p1.y ) / ( p2.x - p1.x )
        let b = p1.y - ( a * p1.x );

        return new LinearFunction( a, b )
    }
}

/**
 * Line segment bounded by two declared Points.
 * 
 * @extends Line
 * @method  length Get line length.
 */
export class LineSegment extends Line {
    constructor() {
        super()
        return this
    }

    /**
     * Measure Line.
     * 
     * @returns {number} Line length.
     */
    get length() {
        const p1 = this.startPoint
        const p2 = this.endPoint

        let LineSegmentLength = Math.sqrt(9);
        return "length"
    }
}

/**
 * Straight line graph.
 */
export class LinearFunction {
    /**
     * Make linear function based on two parameters.
     * y(x)=ax+b
     * 
     * @param {number} a Number that measures how steeply the line is slanted (rise-over-run).
     * @param {number} b Vertical offset of function.
     * @param {number} x Vertical function parameter.
     */
    constructor( a = 1, b = 0, x = undefined ) {

        if ( a === 0 ) return new ConstantFunction( b ) 
        if ( a === 1 && b === 0 && x !== undefined ) return new VerticalFunction( x ) 

        this.a = a
        this.b = b

        return this
    }
    
    /**
     * Find linear function value by passed variable.
     * 
     * @param   {number} x Variable.
     * @returns {number}   Function value.
     */
    getValue( x ) {
        const a = this.a
        const b = this.b

        let y = ( a * x ) + b

        return y
    }
    /**
     * Retrive Point on the function by passing variable.
     * 
     * @param   {number} x Linear function variable.
     * @returns {Point}    Point lying on the function.
     */
    getPoint( x ) {
        const y = this.getValue( x )
        return new Point( x, y )
    }

    /**
     * Find perpendicular function to this LinearFunction by declared Point.
     * 
     * @param   {Point}          point The Point through which the function should pass
     * @returns {LinearFunction}       Perpendicular function.
     */
    findPerpendicularFunctionByPoint( point ) {
        if ( ! point instanceof Point ) {
            throw new TypeError( `Line properties must be Points.` )
            return false
        }

        if ( a === 0 ) return new VerticalFunction( point.x )

        const a = -1 * ( 1 / this.a )
        const b = point.y - ( a * point.x )

        return new LinearFunction( a, b )
    }
}

/**
 * Specic kind of linear function witch always return the same value.
 */
export class ConstantFunction extends LinearFunction {
    constructor( b ) {
        super()
        this.a = 0
        this.b = b

        return this
    }
    
    /**
     * Find perpendicular function to this ConstantFunction by declared Point.
     * 
     * @param   {Point}          point The Point through which the function should pass
     * @returns {LinearFunction}       Perpendicular function.
     */
    findPerpendicularFunctionByPoint( point ) {
        if ( ! point instanceof Point ) {
            throw new TypeError( `Line properties must be Points.` )
            return false
        }

        return new VerticalFunction( point.x )
    }
}

/**
 * Pseudo linear function that is vertical.
 */
export class VerticalFunction extends LinearFunction {
    constructor( x ) {
        super()
        this.x = x

        delete this.getValue

        return this
    }
    
    /**
     * Retirve Point lying on the function by Y coordinate.
     * 
     * @param   {number} y Y coordinate.
     * @returns {Point}    Point lying on the function.
     */
    getPoint( y ) {
        return new Point( this.x, y )
    }
    
    /**
     * Find perpendicular function to this VerticalFunction by declared Point.
     * 
     * @param   {Point}          point The Point through which the function should pass
     * @returns {LinearFunction}       Perpendicular function.
     */
    findPerpendicularFunctionByPoint( point ) {
        if ( ! point instanceof Point ) {
            throw new TypeError( `Line properties must be Points.` )
            return false
        }

        return new ConstantFunction( point.y )
    }
}