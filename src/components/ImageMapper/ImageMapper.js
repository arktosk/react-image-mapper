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

            points: [],
            areas: [
                {
                    points: [],
                    lines: [],
                    coords: '',
                }
            ],
        }
        this.canvas = React.createRef()
        this.state.handleRadius = 10
        this.state.pixelScale = 1

        this.loadImage = new Promise( ( resolve, reject ) => {
            this.state.image.onload = resolve
            this.state.image.onerror = reject
            this.state.image.src = sampleImage
        } )
    }

    componentWillMount() {
        /**
         * Wait for image fully loaded.
         */
        this.loadImage.then( () => {
            this.setState( { loaded: true } )
            console.log( `Image loaded: ${ this.state.image.src }` )
            this.state.handleRadius = Math.round( ( 10 * this.state.image.naturalWidth ) / this.canvas.getBoundingClientRect().width )
            this.state.pixelScale = parseFloat( ( 1 * this.state.image.naturalWidth ) / this.canvas.getBoundingClientRect().width ).toFixed( 2 )
        } )
    }
    componentDidMount() {
        window.addEventListener( 'resize', this.updateGUI.bind( this ) )
    }
    componentDidUpdate() {
        console.log( 'width', this.canvas.getBoundingClientRect() )
    }

    updateGUI() {
        this.setState({
            handleRadius: parseFloat( ( 10 * this.state.image.naturalWidth ) / this.canvas.getBoundingClientRect().width ).toFixed( 2 ),
            pixelScale: parseFloat( ( 1 * this.state.image.naturalWidth ) / this.canvas.getBoundingClientRect().width ).toFixed( 2 )
        });
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
        let naturalPointPosition = {
            x: Math.round( ( relativeCursorPosition.x * this.state.image.naturalWidth ) / canvasScaledSize.width ),
            y: Math.round( ( relativeCursorPosition.y * this.state.image.naturalHeight ) / canvasScaledSize.height ),
        }

        console.log( scrollOffSet, {x:canvasScaledSize.x,y:canvasScaledSize.y} )
        console.log( canvasScaledSize )
        console.log( `Pointer coords: { X: ${relativeCursorPosition.x}, Y: ${relativeCursorPosition.y} }` )

        this.setState( prevState => ({
            points: [...prevState.points, new Point( naturalPointPosition.x, naturalPointPosition.y ) ]
        }))
    }

    render() {
        const image = this.state.image
        const points = this.state.points
        const scale = this.state.pixelScale
        const areaCoords = points.reduce( ( coords, point, index ) => {
            return `${coords}${( index == 0 ? 'M' : ' L' )} ${point.x} ${point.y}`
        },'')

        return (
            <div>
                <div className="mapper">
                    { ( this.state.loaded ?
                        <img className="mapper__layer mapper__layer--background" src={ this.state.image.src } alt="" />    
                    : null ) }
                    <svg ref={ element => { this.canvas = element } } className="mapper__layer mapper_layer--foreground  mapper_layer--interactive" viewBox={`0 0 ${image.naturalWidth} ${image.naturalHeight}`} onClick={ e => this.addNewPoint( e ) }>
                        <g className="area">
                            <path className="" d={ areaCoords } stroke="#000000" strokeWidth="0" style={{ opacity: 0.5 }} />
                            { ( points.length > 0 ) ? points.map( ( point, index ) =>
                                <circle className="handle" key={ index } cx={ point.x } cy={ point.y } r={ scale * 5 } stroke="black" strokeWidth={ scale * 1 } fill="#ffffff" />
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