import React from 'react'
import classNames from 'classnames'
import {Button, Card, Classes, H3, Icon, Intent, Overlay, Tab, Tabs, Toast, Toaster, Position} from '@blueprintjs/core'
import {EndpointGeneral} from "./editorTabs/general";
import {EndpointSchema} from "./editorTabs/schema";
import {EndpointParameters} from "./editorTabs/parameters";

const ErrorToaster = Toaster.create({
    className: "form-error-toaster",
    position: Position.TOP,
});

class EndpointEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasErrors: false,
            error: null,
            aggregation_enabled: false,
            selectedTabId: 'eq'
        };
        this.generalForm = React.createRef();
        this.schemaForm = React.createRef();
        this.parametersForm = React.createRef();
        this.schemaBuilder = React.createRef();
        this.parametersBuilder = React.createRef();
        this.generalBuilder = React.createRef()
    }

    handleErrorOverlayClose = () => (e) => {
        this.setState({hasErrors: false})
    };

    validateState = () => {
        const generalForm = this.generalForm.current;
        const schemaForm = this.schemaForm.current;
        const parametersForm = this.parametersForm.current;
        const generalValidity = generalForm.checkValidity();
        const schemaValidity = schemaForm.checkValidity();
        const parametersValidity = parametersForm.checkValidity();
        if (generalValidity && schemaValidity && parametersValidity) {
            this.setState({error: null, hasErrors: false});
            return true
        }
        let errorForm = null;
        let errorTab = null;
        if (!generalValidity) {
            errorForm = generalForm;
            errorTab = 'eq';
        } else if (!schemaValidity) {
            errorForm = schemaForm;
            errorTab = 'es';
        } else { // parametersValidity
            errorForm = parametersForm;
            errorTab = 'ep';
        }
        this.setState({selectedTabId: errorTab}, () => errorForm.reportValidity());
        ErrorToaster.show({message: "Unable to save. Check for errors", intent: Intent.DANGER});
        return false
    };

    submitForm = () => (e) => {
        if (!this.validateState()) return;
        this.props.onSelectedDescriptionSave()
    };

    endpointChange = () => {
        this.generalBuilder.current.generalChange();
        this.schemaBuilder.current.schemaChange();
        this.parametersBuilder.current.parametersChange();
        this.setState({
            selectedTabId: 'eq',
            aggregation_enabled: this.generalBuilder.current.getAggregationSettings()
        })
    };

    endpointSave = () => {
        this.schemaBuilder.current.schemaSave();
        this.generalBuilder.current.generalSave();
        this.parametersBuilder.current.parametersSave()
    };

    handleTabChange = () => (e) => {
        this.setState({
            aggregation_enabled: this.generalBuilder.current.getAggregationSettings(),
            selectedTabId: e
        })
    }

    render() {
        return <div>
            <Card interactive={false}>
                <Tabs id={"EndpointEditTabs"} selectedTabId={this.state.selectedTabId}
                      onChange={this.handleTabChange()} renderActiveTabPanelOnly={false}>
                    <Tab id={"eq"} title={"General"}
                         panel={
                             <form onSubmit={(e) => e.preventDefault()} ref={this.generalForm}>
                                 <EndpointGeneral ref={this.generalBuilder} {...this.props}/>
                             </form>
                         }/>
                    <Tab id={"es"} title={"Schema"}
                         panel={
                             <form onSubmit={(e) => e.preventDefault()} ref={this.schemaForm}>
                                 <EndpointSchema ref={this.schemaBuilder} {...this.props}
                                                 aggregationEnabled={this.state.aggregation_enabled}
                                 />
                             </form>
                         }/>
                    <Tab id={"ep"} title={"Parameters"}
                         panel={
                             <form onSubmit={(e) => e.preventDefault()} ref={this.parametersForm}>
                                 <EndpointParameters ref={this.parametersBuilder} {...this.props}/>
                             </form>
                         }/>
                    <Button onClick={this.submitForm()} className="formButton submit" icon={"floppy-disk"}
                            text={"Save"}/>
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
        </div>


    }
}

export default EndpointEdit
