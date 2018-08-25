import React    from "react"
import ReactDOM from "react-dom"
import ImageMapper from './components/ImageMapper/ImageMapper'

const Index = () => {
    return <div><h1>Hello React!</h1><p>Hello second time :)</p><ImageMapper single-path="true" /></div>
}

ReactDOM.render( <Index /> , document.getElementById( "index" ) )