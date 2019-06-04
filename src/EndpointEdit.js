import React from 'react'
import {Tabs, Tab, Card} from '@blueprintjs/core'
import {QueryBuilder} from './react-query-builder'

class EndpointSchema extends React.Component {
    constructor(props) {
        super(props)
    }

    onQueryChange(e) {
        this.props.schema = e.getQuery()
    }

    render() {
        return <QueryBuilder onQueryUpdate={this.onQueryChange}/>
    }
}

class EndpointParameters extends React.Component {
    render() {
        return (<div>
            Parameters edit will be here
        </div>)
    }
}

class EndpointEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            schema: null,
            parameters: null
        }
    }

    onTabChange(e) {
        console.log(e)
    }

    render() {
        return <form>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"} onChange={this.onTabChange}>
                    <Tab id={"es"} title={"Schema"} panel={<EndpointSchema schema={this.state.schema}/>}/>
                    <Tab id={"ep"} title={"Parameters"} panel={<EndpointParameters/>}/>
                </Tabs>
            </Card>
        </form>


    }
}

export default EndpointEdit
