function convertToSchema(original, parent = 'root') {
    if (original.type === 'object') {
        return {
            type: 'ConditionGroup',
            objectKey: parent,
            name: original.name || null,
            many: original.many || false,
            aggregation_field: (original.many && original.aggregation_field) || null,
            description: original.description || '',
            children: Object.keys(original.fields || {}).map(name => {
                const field = original.fields[name];
                return convertToSchema(field, name)
            })
        }
    } else if (original.type === 'select') {
        return {
            type: 'SelectCondition',
            fieldName: parent,
            endpoint: {
                name: original.endpoint || null,
                params: original.params || {}
            },
            description: original.description || ''
        }
    } else {
        return {
            type: 'Condition',
            fieldType: original.type || 'string',
            fieldName: parent,
            db_name: original.db_name || null,
            example: original.example || '',
            description: original.description || ''
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
        name: description.name || '',
        description: description.description || '',
        sql: description.sql,
        pagination_enabled: description.pagination_enabled || false,
        aggregation_enabled: description.aggregation_enabled || false,
        key: description.key || null
    };
    const parameters = {
        sql_params: convertParams(description.sql_params || []),
        params: convertParams((description.params || []).map((it, idx) => ({...it, position: idx})))
    };
    const schema = convertToSchema(description.schema || {
        type: 'object',
        name: '',
        description: '',
        fields: {}
    });
    return {
        general, parameters, schema
    }
}


function restoreParams(params) {
    return Object.values(params).map(it => {
        let param = Object.assign({}, it);
        delete param.position;
        return param
    })
}

function restoreSqlParams(params) {
    return Object.values(params)
}


function restoreSchema(schema) {
    if (schema.type === 'ConditionGroup') {
        let fields = {};
        schema.children.forEach(child => {
            const key = child.type === 'ConditionGroup' ? child.objectKey : child.fieldName;
            fields[key] = restoreSchema(child)
        });
        let result = {
            type: 'object',
            name: schema.name,
            description: schema.description,
            fields: fields
        };
        if (schema.many) {
            result.many = schema.many;
            result.aggregation_field = schema.aggregation_field
        }
        return result
    } else if (schema.type === 'SelectCondition') {
        const params = Object.entries(schema.endpoint.params).filter(([key, value]) => key && value);
        return {
            type: 'select',
            description: schema.description,
            endpoint: schema.endpoint.name,
            params: Object.fromEntries(params)
        }

    } else if (schema.type === 'Condition') {
        return {
            type: schema.fieldType,
            db_name: schema.db_name,
            example: schema.example,
            description: schema.description
        }
    } else {
        console.log('wtf?')
    }

}

export function restoreDescription(description) {
    const params = restoreParams(description.parameters.params);
    const sql_params = restoreSqlParams(description.parameters.sql_params);
    const schema = restoreSchema(description.schema);
    return {...description.general, params, sql_params, schema}
}
