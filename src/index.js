import React    from "react"
import ReactDOM from "react-dom"
import ImageMapper from './components/ImageMapper/ImageMapper'

const Index = () => {
    return (
        <div>
            <h1>React Image Mapper Component</h1>
            <ImageMapper single-path="true" />
        </div>
    )
}

ReactDOM.render( <Index /> , document.getElementById( "index" ) )