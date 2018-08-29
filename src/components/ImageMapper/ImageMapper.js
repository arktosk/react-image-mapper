import { Point, Line } from '../../libraries/Geometric/Geometric'

import React, { Component } from "react"
import "./ImageMapper.scss"

import sampleImage from '../../../public/images/cakes-chocolate-close-up-959079.jpg'
// Photo by David Jakab from Pexels

class ImageMapper extends Component {
    constructor( props ) {
        super ( props )

        console.log( props )

        this.state = {
            src: sampleImage || 'https://test.org/storage/map',
            image: new Image(),
            loaded: false,

            coords: '',
            handleRadius: 10,
            pixelScale: 1,

            points: [],
            activePoint: -1,
            areas: [
                {
                    points: [],
                    lines: [],
                    coords: '',
                }
            ],
        }
        this.canvas = React.createRef()
        this.currentPath = React.createRef()
        this.handles = []
        this.move = {
            active: -1,
            initial: { x: null, y: null },
            current: { x: null, y: null },
            offset:  { x: 0, y: 0 },
            currentPoint: { x: null, y: null },
        }

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

        // this.canvas.addEventListener( 'touchstart', this.movePointStart.bind( this ), false )
        // this.canvas.addEventListener( 'touchend',   this.movePointEnd.bind( this ),   false )
        // this.canvas.addEventListener( 'touchmove',  this.movePoint.bind( this ),      false )

        this.canvas.addEventListener( 'mousedown',  this.movePointStart.bind( this ), false )
        this.canvas.addEventListener( 'mouseup',    this.movePointEnd.bind( this ),   false )
        this.canvas.addEventListener( 'mousemove',  this.movePoint.bind( this ),      false )
    }
    componentDidUpdate() {
        // console.log( this.handles )
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

    handleInteractiveLayerClick( event ) {
        // console.log( this.handles.indexOf( event.target ) )
        if ( this.handles.indexOf( event.target ) != -1 ) {
            event.preventDefault()
            event.stopPropagation()
            return false
        }
        else {
            // setActivePoint( this.handles.indexOf( event.target ) )
        }
        this.addNewPoint( event )
    }
    /**
     * Find proportional coordinates to natural size of image.
     * 
     * @param   {number} x Viewport scaled X coordinate.
     * @param   {number} y Viewport scaled Y coordinate.
     * @returns {Object}   Recalculated coordinates.
     */
    recalculatePointNaturalPosition( relativeCursorPositionX, relativeCursorPositionY ) {
        return {
            /**
             * Round values to integer to obtain "pixel perfect" values, that used by <map />.
             */
            x: Math.round( ( relativeCursorPositionX * this.state.image.naturalWidth ) / this.canvas.getBoundingClientRect().width ),
            y: Math.round( ( relativeCursorPositionY * this.state.image.naturalHeight ) / this.canvas.getBoundingClientRect().height ),
        }
    }
    /**
     * Add new Point to interactive layer.
     * 
     * @param {Event} event 
     */
    addNewPoint( event ) {
        let canvas = event.currentTarget
        let canvasBaseSize = canvas.viewBox.baseVal
        let canvasScaledSize = canvas.getBoundingClientRect()
        
        /**
         * Using getBoundingClientRect() method there's no need to calculate window scroll position.
         */
        let canvasPosition = this.canvas.getBoundingClientRect()

        let relativeCursorPosition = {
            x: ( event.clientX - canvasPosition.x ), // + scrollOffSet.x,
            y: ( event.clientY - canvasPosition.y ), // + scrollOffSet.y,
        }
        let naturalPointPosition = this.recalculatePointNaturalPosition( relativeCursorPosition.x, relativeCursorPosition.y )

        this.setState( prevState => {
            /** Add new point next to active one. */
            prevState.points.splice( this.state.activePoint + 1, 0, new Point( naturalPointPosition.x, naturalPointPosition.y ) )

            return {
                activePoint: this.state.activePoint + 1,
                points: [ ...prevState.points ]
            }
        })
    }

    /**
     * Remove point with given index.
     * 
     * @param {number} index 
     */
    removePoint( index ) {
        this.setState( prevState => {
            prevState.points.splice( index, 1 )
            return {
                points: [ ...prevState.points ]
            }
        })
    }
    
    /**
     * Select clicked Point.
     * 
     * @param {Event} event
     * @param {number} index
     */
    selectPoint( event, index ) {
        // event.preventDefault()
        // event.stopPropagation()

        this.setState( { activePoint: index } )
    }

    /**
     * Move curren point.
     * 
     * @param {Event} event 
     * 
     * @todo Make it!
     */
    movePointStart( event ) {
        if ( event.type === "touchstart" ) {
          this.move.initial.x = event.touches[0].clientX // - this.move.offset.x
          this.move.initial.y = event.touches[0].clientY // - this.move.offset.y
        }
        else {
          this.move.initial.x = event.clientX // - this.move.offset.x
          this.move.initial.y = event.clientY // - this.move.offset.y
        }
  
        let indexOfClickedPoint =  this.handles.indexOf( event.target )

        if ( indexOfClickedPoint != -1 ) {
            this.move.active = indexOfClickedPoint
            this.move.currentPoint = this.state.points[ indexOfClickedPoint ]
        }
    }
    movePointEnd( event ) {
        if ( this.move.active != -1 ) {
            event.stopPropagation()
            event.preventDefault()
        }
        this.move.initial.x = this.move.current.x
        this.move.initial.y = this.move.current.y

        // console.log( this.handles[ this.move.active ] )
        if ( this.move.current.x && this.move.current.y ) 
            this.endMoveTranslate( this.move.current.x, this.move.current.y, this.handles[ this.move.active ] )
  
        this.move.active = -1
    }
    movePoint( event ) {
        if ( this.move.active != -1 ) {
            if ( event.type === "touchmove" ) {
                event.preventDefault();
                
                this.move.current.x = event.touches[0].clientX - this.move.initial.x
                this.move.current.y = event.touches[0].clientY - this.move.initial.y
            }
            else {
                this.move.current.x = event.clientX - this.move.initial.x
                this.move.current.y = event.clientY - this.move.initial.y
            }
    
            this.move.offset.x = this.move.current.x
            this.move.offset.y = this.move.current.y
    
            let draggedPoint = this.handles[ this.move.active ]
            this.setMoveTranslate( this.move.current.x, this.move.current.y, draggedPoint )
            
            // let naturalPointPosition = this.recalculatePointNaturalPosition( this.move.current.x, this.move.current.y )
            // this.setState( prevState => {
            //     let draggedPoint = prevState.points[ this.move.active ]
            //     draggedPoint = {
            //         x: this.move.currentPoint.x + naturalPointPosition.x,
            //         y: this.move.currentPoint.y + naturalPointPosition.y,
            //     }
            //     prevState.points[ this.move.active ] = draggedPoint
            //     return {
            //         points: [ ...prevState.points ]
            //     }
            // })
        }
    }
    setMoveTranslate( x, y, draggedPoint ) {
        let canvasPosition = this.canvas.getBoundingClientRect()
        let naturalPointPosition = this.recalculatePointNaturalPosition( x, y )
        let initialPointPosition = this.recalculatePointNaturalPosition( this.move.initial.x - canvasPosition.x, this.move.initial.y - canvasPosition.y )
        draggedPoint.style.transform = "translate3d( " + naturalPointPosition.x + "px, " + naturalPointPosition.y + "px, 0 )"

        this.state.points[ this.move.active ].x = initialPointPosition.x + naturalPointPosition.x
        this.state.points[ this.move.active ].y = initialPointPosition.y + naturalPointPosition.y
        this.updatePathCoordinates()
    }
    /**
     * Rewrite translate values to <circle> position attributes and clear offset properties.
     * @param {number}  translateOffsetX 
     * @param {number}  translateOffsetY 
     * @param {Element} draggedPoint 
     */
    endMoveTranslate( translateOffsetX, translateOffsetY, draggedPoint ) {
        let naturalPointPosition = this.recalculatePointNaturalPosition( translateOffsetX, translateOffsetY )
        let initialPosition = {
            x: parseInt( draggedPoint.getAttribute( 'cx' ) ),
            y: parseInt( draggedPoint.getAttribute( 'cy' ) ),
        }
        /** Clear transform style. */
        draggedPoint.style.transform = null;
        /** Rewrite position. */
        draggedPoint.setAttribute( 'cx', initialPosition.x + naturalPointPosition.x )
        draggedPoint.setAttribute( 'cy', initialPosition.y + naturalPointPosition.y )

        
        // let naturalPointPosition = this.recalculatePointNaturalPosition( this.move.current.x, this.move.current.y )
        // this.setState( prevState => {
        //     let draggedPoint = prevState.points[ this.move.active ]
        //     draggedPoint = {
        //         x: this.move.currentPoint.x + naturalPointPosition.x,
        //         y: this.move.currentPoint.y + naturalPointPosition.y,
        //     }
        //     prevState.points[ this.move.active ] = draggedPoint
        //     return {
        //         points: [ ...prevState.points ]
        //     }
        // })
        this.setState()
        
        /** Clear offset properties. */
        this.move.initial = { x: null, y: null }
        this.move.current = { x: null, y: null }
        this.move.offset  = { x: 0, y: 0 }
    }

    updatePathCoordinates() {
        const points = this.state.points
        const areaCoords = points.reduce( ( coords, point, index ) => {
            return `${coords}${( index == 0 ? 'M' : ' L' )} ${point.x} ${point.y}`
        },'')
        this.currentPath.setAttribute( 'd', areaCoords )
    }

    render() {
        const image = this.state.image
        const active = this.state.activePoint
        const points = this.state.points
        const scale = this.state.pixelScale
        const areaCoords = points.reduce( ( coords, point, index ) => {
            return `${coords}${( index == 0 ? 'M' : ' L' )} ${point.x} ${point.y}`
        },'')

        const Handle = ( point, index ) =>
            <circle
                ref={ element => { this.handles[ index ] = element } }
                onClick={ event => { this.selectPoint( event, index ) } }
                onDoubleClick={ () => { this.removePoint( index ) } }
                className="mapper__handle" key={ index }
                cx={ point.x } cy={ point.y } r={ ( scale * 5 ) }
                stroke={ active == index ? "red" : "black" } strokeWidth={ scale * 1 } fill="white" />

        return (
            <div>
                <div className="mapper">
                    { ( this.state.loaded ?
                        <img className="mapper__layer mapper__layer--background" src={ this.state.image.src } alt="" />    
                    : null ) }
                    <svg ref={ element => { this.canvas = element } } className="mapper__layer mapper__layer--foreground  mapper_layer--interactive" viewBox={`0 0 ${image.naturalWidth} ${image.naturalHeight}`} onClick={ e => this.handleInteractiveLayerClick( e ) }>
                        <g className="area">
                            <path ref={ e => { this.currentPath = e } } className="" d={ areaCoords } stroke="#000000" strokeWidth="0" style={{ opacity: 0.5 }} />
                            { ( points.length > 0 ) ? points.map( Handle ) : null }
                        </g>
                    </svg>
                </div>
                <div>
                    <p>
                        <label><span>Image src:</span><input name="src" type="text" value={this.state.src} onChange={ e => { this.handleChangeInput(e) } } /></label></p>
                    <p><input name="coords" type="text" value={areaCoords} onChange={ e => { this.handleChangeInput(e) } } /></p>
                </div>
                <p>{this.state.src}</p>
                <p>{areaCoords}</p>
            </div>
        )
    }
}

export default ImageMapper