import React from 'react'
import classNames from 'classnames'
import {
    Tabs,
    Tab,
    Card,
    Button,
    ControlGroup,
    Intent,
    Overlay,
    Classes,
    H3,
    FormGroup,
    InputGroup
} from '@blueprintjs/core'
import QueryBuilder from './react-query-builder'

function convertToSchema(original, parent = 'root') {
    if (original.type === 'object') {
        return {
            type: 'ConditionGroup',
            objectKey: parent,
            name: original.name,
            description: original.description,
            children: Object.keys(original.fields).map(name => {
                const field = original.fields[name]
                return convertToSchema(field, name)
            })
        }
    } else if (original.type === 'select') {
        return {
            type: 'SelectCondition',
            fieldName: parent,
            endpointSelect: original.endpoint,
            params: original.params,
            description: ''
        }
    } else {
        return {
            type: 'Condition',
            fieldType: original.type,
            fieldName: parent,
            db_name: original.db_name,
            example: original.example,
            description: original.description
        }
    }
}

class EndpointSchema extends React.Component {
    constructor(props) {
        super(props);
    }


    onQueryChange = () => (e) => {
        this.props.state.schema = e.getQuery()
    }

    render() {
        let schema = this.props.source.description.schema
        if (!schema) {
            schema = {
                type: 'ConditionGroup',
                objectKey: 'root',
                name: '',
                description: '',
                children: []
            }
        } else {
            schema = convertToSchema(schema)
        }
        this.props.state.schema = schema
        return <QueryBuilder onQueryUpdate={this.onQueryChange()} initialQuery={schema}/>

    }
}

class EndpointGeneral extends React.Component {

    addName = () => (e) => {
        this.props.state.description.name = e.target.value
    }

    render() {
        return (
            <Card>
                <FormGroup>
                    <InputGroup className="endpoint name" placeholder={"Endpoint name"}
                                defaultValue={this.props.state.description.name}
                                onChange={this.addName()} required/>
                </FormGroup>
            </Card>
        )
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
            hasErrors: false,
            error: null,
            schema: null
        }
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

    render() {
        return <form onSubmit={this.submitForm()}>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"}>
                    <Tab id={"eq"} title={"General"} panel={<EndpointGeneral state={this.props}/>}/>
                    <Tab id={"es"} title={"Schema"} panel={<EndpointSchema source={this.props} state={this.state}/>}/>
                    <Tab id={"ep"} title={"Parameters"} panel={<EndpointParameters state={this.props}/>}/>
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
