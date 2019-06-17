export function convertToSchema(original, parent = 'root') {
    if (original.type === 'object') {
        return {
            type: 'ConditionGroup',
            objectKey: parent,
            name: original.name,
            many: original.many || false,
            aggregation_field: original.many && original.aggregation_field,
            description: original.description,
            children: Object.keys(original.fields).map(name => {
                const field = original.fields[name];
                return convertToSchema(field, name)
            })
        }
    } else if (original.type === 'select') {
        return {
            type: 'SelectCondition',
            fieldName: parent,
            endpoint: {
                name: original.endpoint,
                params: original.params
            },
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

function convertParams(params) {
    const result = {};
    params.forEach(it => result[it.position] = it);
    return result
}

export function convertDescription(description) {
    const general = {
        name: description.name,
        description: description.description,
        sql: description.sql,
        pagination_enabled: description.pagination_enabled,
        aggregation_enabled: false,
        key: description.pagination_key
    };
    const parameters = {
        sql_params: convertParams(description.sql_params),
        params: convertParams(description.params.map((it, idx) => ({...it, position: idx})))
    };
    const schema = convertToSchema(description.schema);
    return {
        general, parameters, schema
    }
}
