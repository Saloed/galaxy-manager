import React from "react";

const knownTypes = [
    {value: 'string', display: 'string', className: 'type-str'},
    {value: 'integer', display: 'integer', className: 'type-int'},
    {value: 'boolean', display: 'boolean', className: 'type-bool'},
    {value: 'date', display: 'date', className: 'type-date'},
    {value: 'date-time', display: 'date-time', className: 'type-datetime'}
];

export const knownTypesOptions = knownTypes.map(function (operator, index) {
    const classString = 'operator ' + operator.className;
    return (<option className={classString} value={operator.value} key={index}>{operator.display}</option>);
});

function arraySubtract(from, array) {
    return from.filter(i => array.indexOf(i) < 0);
}

function collectDbNames(root) {
    if (root.type === 'Condition') {
        return root.db_name ? [root.db_name] : []
    } else if (root.type === 'ConditionGroup') {
        let result = [];
        root.children.forEach(child => {
            result.push(...collectDbNames(child))
        });
        return result
    }
    return []
}

export function fieldOptionsForSql(sql, rootNode) {
    const usedFields = rootNode ? collectDbNames(rootNode) : [];
    const all_sql_fields = sql.fields;
    const sql_fields = arraySubtract(all_sql_fields, usedFields);
    const normalFieldsOptions = sql_fields.map(function (operator, index) {
        const classString = 'operator ' + operator;
        return (<option className={classString} value={operator} key={index}>{operator}</option>);
    })
    const usedFieldsOptions = usedFields.map(function (operator, index) {
        const idx = index + normalFieldsOptions.length;
        const classString = 'bp3-menu-item bp3-intent-danger operator ' + operator;
        return (<option className={classString} value={operator} key={idx}>{operator}</option>);
    })

    return normalFieldsOptions.concat(usedFieldsOptions)
}
