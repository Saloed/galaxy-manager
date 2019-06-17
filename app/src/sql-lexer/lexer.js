const {Parser} = require('flora-sql-parser');
const flora_parser = new Parser();

function prepare_query(query) {
    return query.replace(new RegExp('\\$', 'g'), 'DOLLAR_SIGN_RESERVED')
        .replace(new RegExp('%s', 'g'), 'PERCENT_SIGN_RESERVED')
        .replace(new RegExp('#', 'g'), 'DIEZ_SIGN_RESERVED')
        .replace(new RegExp('&', 'g'), 'AND')
        .replace(new RegExp('0[xX][0-9a-fA-F]+', 'g'), '0')
}

function restore_name(name) {
    return name.replace(new RegExp('DOLLAR_SIGN_RESERVED', 'g'), '$')
        .replace(new RegExp('PERCENT_SIGN_RESERVED', 'g'), '%s')
        .replace(new RegExp('DIEZ_SIGN_RESERVED', 'g'), '#')
}

function remove_balanced_parenthesis(query) {
    let count = 0;
    const result = [];
    query.split('').forEach(ch => {
        if (ch === '(') {
            count++
        } else if (ch === ')') {
            count--
        } else if (count === 0) {
            result.push(ch)
        }
    });
    return result.join('')
}

function get_field_names_definition_range(query) {
    const myQuery = query.replace(/(\r\n|\n|\r)/gm, " ");
    const pattern = new RegExp("SELECT(.*?)(\\sFROM\\s|\\sUNION\\s|$)", "i");
    const parts = myQuery.match(pattern);
    return parts[1]
}

function get_field_names(query) {
    return query.split(',').map(it => {
        const parts = it.split(new RegExp('\\sAS\\s', "i"));
        return parts[parts.length - 1]
    }).map(it => it.trim())
}

const getQueryFieldNames = (query) => {
    try {
        const prepared_query = prepare_query(query);
        const parsed = flora_parser.parse(prepared_query);
        return parsed.columns.map(it => {
            const name = it.as || it.expr.column;
            return restore_name(name).trim()
        })
    } catch (e) {

    }
    const withoutParenthesis = remove_balanced_parenthesis(query);
    try {
        const prepared_query = prepare_query(withoutParenthesis);
        const parsed = flora_parser.parse(prepared_query);
        return parsed.columns.map(it => {
            const name = it.as || it.expr.column;
            return restore_name(name).trim()
        })
    } catch (e) {

    }

    const fieldDefinitions = get_field_names_definition_range(withoutParenthesis);
    return get_field_names(fieldDefinitions)
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const uniqueFieldNames = (query) => {
    return getQueryFieldNames(query).filter(onlyUnique);
}

export default uniqueFieldNames
