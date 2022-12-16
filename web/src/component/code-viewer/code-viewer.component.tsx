import { FC } from "react"

import Editor from 'react-simple-code-editor';
import { languages, highlight } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';

export const CodeViewerComponent: FC<{ code: string }> = ({ code }) => {
    return <>
        <Editor
            value={code}
            readOnly={true}
            onValueChange={e => console.log(e)}
            highlight={code => highlight(code, languages.json, 'json')}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                maxHeight: '85vh',
                overflowY: 'auto',
                background: 'black'
            }}
        />
    </>
}