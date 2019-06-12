import React from 'react'
import classNames from 'classnames'
import {Button, Card, Classes, FormGroup, H3, InputGroup, Intent, Overlay, Tab, Tabs} from '@blueprintjs/core'
import QueryBuilder from './react-query-builder'


class EndpointSchema extends React.Component {
    constructor(props) {
        super(props);
        this.queryBuilder = React.createRef()
    }

    schemaChange = () => {
        this.queryBuilder.current.updateQuery(this.props.description.schema)

    }

    schemaSave = () => {
        this.props.description.schema = this.queryBuilder.current.getQuery()
    }

    render() {
        return <QueryBuilder ref={this.queryBuilder}
                             initialQuery={this.props.description.schema}
                             allSql={this.props.allSql}
                             allDescriptions={this.props.allDescriptions}
                             sql={this.props.sql}
                             description={this.props.description}
        />
    }
}

class EndpointGeneral extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    addName = () => (e) => {
        this.setState({name: e.target.value})
    }

    generalChange = () => {
        this.setState({
            name: this.props.description.general.name
        })
    }

    generalSave = () => {
        this.props.description.general = this.state
    }

    render() {
        return (
            <Card>
                <FormGroup>
                    <InputGroup className="endpoint name" placeholder={"Endpoint name"}
                                defaultValue={this.state.name}
                                onChange={this.addName()} required/>
                </FormGroup>
            </Card>
        )
    }
}

class EndpointParameters extends React.Component {

    parametersChange = () => {
        console.log(this.props.description.parameters)
    }

    parametersSave = () => {
        console.log(this.props.description.parameters)
    }

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
            hasErrors: false,
            error: null
        }
        this.schemaBuilder = React.createRef()
        this.parametersBuilder = React.createRef()
        this.generalBuilder = React.createRef()
    }

    handleErrorOverlayClose = () => (e) => {
        this.setState({hasErrors: false})
    }

    validateState = () => {
        console.log(this.state)
        const isValid = true
        const validationError = 'message'
        if (isValid) {
            this.setState({error: null, hasErrors: false})
            return true
        } else {
            this.setState({error: validationError, hasErrors: true})
            return false
        }
    }

    submitForm = () => (e) => {
        e.preventDefault()
        if (!this.validateState()) return
    }

    endpointChange = () => {
        this.schemaBuilder.current.schemaChange()
        this.generalBuilder.current.generalChange()
        this.parametersBuilder.current.parametersChange()
    }

    endpointSave = () => {
        this.schemaBuilder.current.schemaSave()
        this.generalBuilder.current.generalSave()
        this.parametersBuilder.current.parametersSave()
    }

    render() {
        return <form onSubmit={this.submitForm()}>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"}>
                    <Tab id={"eq"} title={"General"}
                         panel={<EndpointGeneral ref={this.generalBuilder} {...this.props}/>}/>
                    <Tab id={"es"} title={"Schema"}
                         panel={<EndpointSchema ref={this.schemaBuilder} {...this.props} />}/>
                    <Tab id={"ep"} title={"Parameters"}
                         panel={<EndpointParameters ref={this.parametersBuilder} {...this.props}/>}/>
                    <Button type="submit" className="formButton submit" icon={"floppy-disk"} text={"Save"}/>
                </Tabs>
            </Card>
            <Overlay onClose={this.handleErrorOverlayClose()}
                     className={Classes.OVERLAY_SCROLL_CONTAINER}
                     isOpen={this.state.hasErrors} autoFocus={true} enforceFocus={true} canEscapeKeyClose={true}
                     canOutsideClickClose={true} hasBackdrop={true} usePortal={true}>
                <div className={classNames(Classes.CARD, Classes.ELEVATION_4)}>
                    <H3>Descriptions contains errors!</H3>
                    {this.state.error}
                    <br/>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button intent={Intent.DANGER} onClick={this.handleErrorOverlayClose()}
                                style={{margin: ""}}>
                            Close
                        </Button>

                    </div>
                </div>
            </Overlay>
        </form>


    }
}

export default EndpointEdit
