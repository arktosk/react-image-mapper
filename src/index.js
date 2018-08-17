import React    from "react";
import ReactDOM from "react-dom";

const Index = () => {
    return <div><h1>Hello React!</h1><p>Hello second time :)</p></div>;
};

ReactDOM.render( <Index/> , document.getElementById( "index" ) );