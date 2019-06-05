import {tokenise} from 'sql-lint/dist/src/lexer/lexer'
import {Query} from 'sql-lint/dist/src/reader/query'
import {Line} from 'sql-lint/dist/src/reader/line'

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
    const selectTokenIdx = tokens.findIndex(it => it.type === 'keyword' && it.value === 'select')
    const fromTokenIdx = tokens.findIndex(it => it.type === 'keyword' && it.value === 'from')
    return tokens.slice(selectTokenIdx, fromTokenIdx)
}

const tokenizeSql = (query) => {
    const queryObj = getQueryFromLine(query)
    tokenise(queryObj)
    let tokens = []
    queryObj.lines.map(line => {
        tokens.push(...line.tokens)
    })
    const nameTokens = getTokensFromSelectToFrom(tokens)
    console.log(nameTokens)
}

export default tokenizeSql
