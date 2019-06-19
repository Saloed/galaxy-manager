import React from "react";
import {ControlGroup, FormGroup, HTMLSelect, InputGroup, Switch, TextArea} from "@blueprintjs/core";

export class EndpointGeneral extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            pagination_enabled: false,
            aggregation_enabled: false,
            key: null
        }
    }

    getAggregationSettings = () => {
        return this.state.aggregation_enabled
    }

    addName = () => (e) => {
        this.setState({name: e.target.value})
    };

    changeDescription = () => (e) => {
        this.setState({description: e.target.value})
    };


    handlePaginationEnabledChange = () => (e) => {
        this.setState({pagination_enabled: e.target.checked})
    };

    handleAggregationEnabledChange = () => (e) => {
        this.setState({aggregation_enabled: e.target.checked})
    };


    generalChange = () => {
        this.setState(this.props.description.general)
    };

    generalSave = () => {
        this.props.description.general = this.state
    };

    getSqlFields = () => {
        const sql_fields = this.props.sql.fields;
        return sql_fields.map(function (operator, index) {
            const classString = 'operator ' + operator;
            return (<option className={classString} value={operator} key={index}>{operator}</option>);
        });
    };


    onKeySelectChange = () => (e) => {
        const value = e.target.value === '' ? null : e.target.value;
        this.setState({key: value})
    };

    render() {
        return (
            <ControlGroup vertical={true}>
                <FormGroup label="Endpoint name"
                           labelFor="text-input"
                           labelInfo="(required)"
                >
                    <InputGroup id="text-input"
                                className="endpoint name"
                                placeholder={"Endpoint name"}
                                defaultValue={this.state.name}
                                onChange={this.addName()}
                                required/>
                </FormGroup>
                <FormGroup label="Select key field"
                           labelFor="key-field"
                           labelInfo="(optional)">
                    <HTMLSelect id={"key-select"}
                                className="endpoints"
                                value={this.state.key || ''}
                                onChange={this.onKeySelectChange()}>
                        <option value=""/>
                        {this.getSqlFields()}
                    </HTMLSelect>
                </FormGroup>
                <Switch checked={this.state.pagination_enabled}
                        disabled={!this.state.key}
                        label="Pagination"
                        onChange={this.handlePaginationEnabledChange()}
                />
                <Switch checked={this.state.aggregation_enabled}
                        disabled={!this.state.key}
                        label="Aggregation"
                        onChange={this.handleAggregationEnabledChange()}
                />
                <FormGroup label="Endpoint description"
                           labelFor="text-input"
                           labelInfo="(optional)"
                >
                    <TextArea id="text-input"
                              className="endpoint name"
                              placeholder={"Endpoint description"}
                              defaultValue={this.state.desciption}
                              onChange={this.changeDescription()}
                    />
                </FormGroup>
            </ControlGroup>
        )
    }
}
