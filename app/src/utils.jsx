import React from "react";

const knownTypes = [
    {value: 'string', display: 'string', className: 'type-str'},
    {value: 'integer', display: 'integer', className: 'type-int'},
    {value: 'boolean', display: 'boolean', className: 'type-bool'},
    {value: 'datetime', display: 'datetime', className: 'type-datetime'}
];

export const knownTypesOptions = knownTypes.map(function (operator, index) {
    const classString = 'operator ' + operator.className;
    return (<option className={classString} value={operator.value} key={index}>{operator.display}</option>);
});

export function fieldOptionsForSql(sql) {
    const sql_fields = sql.fields;
    return sql_fields.map(function (operator, index) {
        const classString = 'operator ' + operator;
        return (<option className={classString} value={operator} key={index}>{operator}</option>);
    })
}
