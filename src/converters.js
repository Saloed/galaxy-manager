export function convertToSchema(original, parent = 'root') {
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

export function convertDescription(description) {
    const general = {
        name: description.name,
        description: description.description,
        sql: description.sql,
        pagination_enabled: description.pagination_enabled,
        pagination_key: description.pagination_key
    }
    const parameters = {
        sql_params: description.sql_params,
        params: description.params
    }
    const schema = convertToSchema(description.schema)
    return {
        general, parameters, schema
    }
}
