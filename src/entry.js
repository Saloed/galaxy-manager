import React from 'react';
import ReactDOM from 'react-dom';
import EndpointEdit from './EndpointEdit'

class App extends React.Component {

    render() {



        return (<EndpointEdit/>);
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
