import {tokenise} from 'sql-lint/dist/src/lexer/lexer'
import {Query} from 'sql-lint/dist/src/reader/query'
import {Line} from 'sql-lint/dist/src/reader/line'
import {Select} from 'sql-lint/dist/src/lexer/statements/select'

const tssql_parser = require('js-tsql-parser');
const js_parser = require('js-sql-parser');
const {lexer, parser} = require('sql-parser');
const {Parser} = require('flora-sql-parser');
const flora_parser = new Parser();

export function putContentIntoLines(contents) {
    let lineNumber = 1;
    const queriesFromFile = [];
    let currentQueryContent = "";
    let query = new Query();
    const skipChars = ["", "\n", "\r\n"];

    contents = stripComments(contents);

    for (let i = 0; i < contents.length; i++) {
        if (!skipChars.includes(contents[i])) {
            currentQueryContent += contents[i];
        }

        if (contents[i] === "\n") {
            if (currentQueryContent.length > 0) {
                query.lines.push(new Line(currentQueryContent, lineNumber));
            }
            currentQueryContent = "";
            lineNumber++;
        }

        if (contents[i] === ";") {
            if (currentQueryContent.length > 0) {
                query.lines.push(new Line(currentQueryContent, lineNumber));
            }
            queriesFromFile.push(query);
            query = new Query();
            currentQueryContent = "";
        }
    }

    return query;
}

/**
 * 1. Split on new line
 * 2. Filter out any lines that start with a comment
 * 3. Rejoin the lines together as a single string.
 */
function stripComments(content) {
    return content
        .split("\n")
        .map(line => {
            if (
                line.startsWith("--") ||
                line.startsWith("#") ||
                line.startsWith("/*")
            ) {
                return "";
            } else {
                return line;
            }
        })
        .join("\n");
}

/**
 * Grabs the query from the --query flag
 * Line is always 0 since there are no
 * lines on the terminal.
 */
function getQueryFromLine(query) {
    return putContentIntoLines(query);
}


function getTokensFromSelectToFrom(tokens) {
    const selectTokenIdx = tokens.findIndex(it => it.type === 'keyword' && it.value === 'select');
    const fromTokenIdx = tokens.findIndex(it => it.type === 'keyword' && it.value === 'from');
    return tokens.slice(selectTokenIdx, fromTokenIdx + 1)
}

function collectNames(tokens) {
    let names = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === "???" && token.value === "as") {
            const nextToken = tokens[i + 1];
            if (nextToken) {
                names.push(nextToken)
            }
        }
    }
    return names.map(it => it.value)

}

function recoverNames(originalQuery, names) {
    const withoutComments = stripComments(originalQuery);
    let queryElements = withoutComments.split("\n").flatMap(it => it.trim().split(/\s+/));
    const queryElementsMap = {};
    queryElements.forEach(it => {
        const key = it.toLowerCase();
        if (!queryElementsMap[key]) queryElementsMap[key] = it
    });

    return names.map(it => queryElementsMap[it] || it)
}

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
    const pattern = new RegExp("SELECT(.*?)(FROM|UNION|$)")
    console.log(myQuery)
    const parts = myQuery.match(pattern)
    console.log(parts)
    return parts[1]
}

const getQueryFieldNames = (query) => {
    try {
        const prepared_query = prepare_query(query);
        const parsed = flora_parser.parse(prepared_query);
        return parsed.columns.map(it => {
            const name = it.as || it.expr.column;
            return restore_name(name)
        })
    } catch (e) {
        console.log(e)
    }
    console.log(query)
    const withoutParenthesis = remove_balanced_parenthesis(query);
    const fieldDefinitions = get_field_names_definition_range(withoutParenthesis)
    console.log(fieldDefinitions)

    // const queryObj = getQueryFromLine(query);
    // console.log(queryObj);
    // tokenise(queryObj);
    // let tokens = [];
    // queryObj.lines.map(line => {
    //     tokens.push(...line.tokens)
    // });
    // const nameTokens = getTokensFromSelectToFrom(tokens);
    // console.log(nameTokens)
    // const selectFromStr = nameTokens.map(it => it.value).join(' ')
    // const names = collectNames(nameTokens);
    // const aaa = selectFromStr.replace(new RegExp('\\$', 'g'), 'DOLLAR_SIGN_RESERVED')
    // console.log(aaa)
    // const ast = parser.parse(aaa);
    // console.log(ast)
    // return recoverNames(query, names)
};

export default getQueryFieldNames
