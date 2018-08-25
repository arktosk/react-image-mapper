import React, { Component } from "react"
import "./ImageMapper.scss"

import sampleImage from '../../../public/images/cakes-chocolate-close-up-959079.jpg'
// Photo by David Jakab from Pexels

class Point {
    constructor( x, y ) {
        // if ( typeof x === 'object' && y == undefined ) {
        //     let coords = x
        //     if ( !isNaN( coords.x ) && !isNaN( coords.y ) ) {
        //         this.x = x
        //         this.y = y
        //         return this
        //     }
        //     else {
        //         throw new TypeError( 'Point :: First parameter must be an object or X coord!' )
        //     }
        // }
        this.x = x
        this.y = y
        return this
    }
}

class ImageMapper extends Component {
    constructor( props ) {
        super ( props )

        console.log( props )

        this.state = {
            src: sampleImage || 'https://test.org/storage/map',
            image: new Image(),
            loaded: false,

            coords: '',

            points: [
                // new Point ( 0, 10 ),
                // new Point ( 10, 10 ),
                // new Point ( 20, 10 ),
                // new Point ( 10, 90 ),
            ],
            areas: [
                {
                    points: [],
                    lines: [],
                    coords: '',
                }
            ],
        }

        this.loadImage = new Promise( ( resolve, reject ) => {
            this.state.image.onload = () => { resolve() }
            this.state.image.onerror = () => { reject() }
            this.state.image.src = sampleImage
        } )
    }

    componentWillMount() {
        this.loadImage.then( () => {
            this.setState( { loaded: true } )
            console.log( `Image loaded: ${ this.state.image.src }` )
        } )
    }

    handleChangeInput( event ) {
        if ( typeof this.state[ event.target.name ] !== 'undefined' )
            this.setState( { [ event.target.name ]: event.target.value } );
    }

    addNewPoint( event ) {
        let canvas = event.currentTarget
        let canvasBaseSize = canvas.viewBox.baseVal
        let canvasScaledSize = canvas.getBoundingClientRect()

        let viewPortMousePosition = {
            x: event.clientX,
            y: event.clientY,
        }
        let canvasPosition = canvas.getBoundingClientRect()
        let scrollOffSet = {
            x: window.scrollX,
            y: window.scrollY,
        }

        let relativeCursorPosition = {
            x: ( event.clientX - canvasPosition.x ), // + scrollOffSet.x,
            y: ( event.clientY - canvasPosition.y ), // + scrollOffSet.y,
        }

        console.log( scrollOffSet, {x:canvasScaledSize.x,y:canvasScaledSize.y} )
        console.log( canvasScaledSize )
        console.log( `Pointer coords: { X: ${relativeCursorPosition.x}, Y: ${relativeCursorPosition.y} }` )

        this.setState( prevState => ({
            points: [...prevState.points, new Point( relativeCursorPosition.x, relativeCursorPosition.y ) ]
        }))
    }

    render() {
        const points = this.state.points
        const areaCoords = points.reduce( ( coords, point, index ) => {
            return `${coords}${( index == 0 ? 'M' : ' L' )} ${point.x} ${point.y}`
        },'')

        return (
            <div>
                <div className="mapper">
                    { ( this.state.loaded ?
                        <img className="mapper__layer mapper__layer--background" src={ this.state.image.src } alt="" />    
                    : null ) }
                    <svg className="mapper__layer mapper_layer--foreground  mapper_layer--interactive" viewBox={`0 0 400 400`} onClick={ e => this.addNewPoint( e ) }>
                        <g className="area">
                            <path className="" d={ areaCoords } stroke="#000000" />
                            { ( points.length > 0 ) ? points.map( ( point, index ) =>
                                <circle className="handle" key={ index } cx={ point.x } cy={ point.y } r="1.5" stroke="black" strokeWidth="0.5" fill="#ffffff" />
                             ) : null }
                        </g>
                    </svg>
                </div>
                <div>
                    <p>
                        <label><span>Image src:</span><input name="src" type="text" value={this.state.src} onChange={ e => { this.handleChangeInput(e) } } /></label></p>
                    <p><input name="coords" type="text" value={areaCoords} onChange={ e => { this.handleChangeInput(e) } } /></p>
                </div>
                <p>Here will be rendered image mapper component :P</p>
                <p>{this.state.src}</p>
                <p>{areaCoords}</p>
            </div>
        )
    }
}

export default ImageMapper