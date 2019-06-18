import React from 'react'
import classNames from 'classnames'
import {Button, Card, Classes, H3, Intent, Overlay, Tab, Tabs} from '@blueprintjs/core'
import {EndpointGeneral} from "./editorTabs/general";
import {EndpointSchema} from "./editorTabs/schema";
import {EndpointParameters} from "./editorTabs/parameters";


class EndpointEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasErrors: false,
            error: null,
            aggregation_enabled: false
        };
        this.schemaBuilder = React.createRef();
        this.parametersBuilder = React.createRef();
        this.generalBuilder = React.createRef()
    }

    handleErrorOverlayClose = () => (e) => {
        this.setState({hasErrors: false})
    };

    validateState = () => {
        console.log(this.state);
        const isValid = true;
        const validationError = 'message';
        if (isValid) {
            this.setState({error: null, hasErrors: false});
            return true
        } else {
            this.setState({error: validationError, hasErrors: true});
            return false
        }
    };

    submitForm = () => (e) => {
        e.preventDefault();
        if (!this.validateState()) return
        this.props.onSelectedDescriptionSave()
    };

    endpointChange = () => {
        this.generalBuilder.current.generalChange();
        this.schemaBuilder.current.schemaChange();
        this.parametersBuilder.current.parametersChange()
        this.setState({aggregation_enabled: this.generalBuilder.current.getAggregationSettings()})
    };

    endpointSave = () => {
        this.schemaBuilder.current.schemaSave();
        this.generalBuilder.current.generalSave();
        this.parametersBuilder.current.parametersSave()
    };

    handleTabChange = () => (e) => {
        this.setState({aggregation_enabled: this.generalBuilder.current.getAggregationSettings()})
    }

    render() {
        return <form onSubmit={this.submitForm()}>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"} onChange={this.handleTabChange()}>
                    <Tab id={"eq"} title={"General"}
                         panel={<EndpointGeneral ref={this.generalBuilder} {...this.props}/>}/>
                    <Tab id={"es"} title={"Schema"}
                         panel={<EndpointSchema ref={this.schemaBuilder} {...this.props}
                                                aggregationEnabled={this.state.aggregation_enabled}
                         />}/>
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
