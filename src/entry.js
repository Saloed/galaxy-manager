import React from 'react';
import ReactDOM from 'react-dom';
import yaml from 'js-yaml'
import tokenize from './sql-lexer'

import EndpointEdit from './EndpointEdit'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    onFileChange = () => (e) => {
        e.preventDefault()
        const files = document.getElementById("files").files;
        const sql_files = []
        const descriptions = []
        console.log(files)
        for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
            const fileName = files[fileIdx].name
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result
                if (fileName.endsWith('.sql')) {
                    const tokens = tokenize(data);
                    console.log(tokens);
                    // const parsed = parser.parse(tokens)
                    // console.log(parsed);
                    sql_files.push({
                        name: fileName,
                        sql: tokens
                    })
                } else if (fileName.endsWith('.yaml')) {
                    const descriptions = yaml.load(data)
                    console.log(descriptions)
                } else {
                    // skip
                }
            }
            reader.readAsText(files[fileIdx], 'UTF-8');
        }
        console.log(sql_files)

    }

    render() {


        // return (<EndpointEdit/>);
        return (<form onSubmit={this.onFileChange()}>
                <input type="file" name="files" webkitdirectory="" directory="" multiple="" id="files"/>
                <input type="submit"/>
            </form>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
