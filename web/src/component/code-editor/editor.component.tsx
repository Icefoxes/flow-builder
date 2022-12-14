import { FC, useEffect, useRef, useState } from "react"
import { message } from "antd";
import {
    CloseOutlined,
} from '@ant-design/icons';
import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor"
import { useNavigate } from "react-router-dom";
import { TerminalContextProvider } from "react-terminal";

import './editor.component.scss';

import { TerminalComponent } from './terminal';
import { EditorToolBarComponent, EditorToolbarControlType } from './toolbar';
import { onMonacoWillMount } from "./editor.before.mount";
import { Flow, NodeType } from "../../model";
import utils from "../shared/util";


export interface CodeEditProps {
    code: string;
    sidebarWidth: number;
    onSaveFlow: (flow: Flow) => void,
    isLoading: boolean,
    activeFlow: Flow | null,
    setActiveFlow: (flow: Flow) => void,
}


export const CodeEditComponent: FC<CodeEditProps> = ({ code, onSaveFlow, isLoading, activeFlow, sidebarWidth, setActiveFlow }) => {
    const navigation = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    // state
    const [terminalVisible, setTerminalVisible] = useState<boolean>(true);
    const [editorWidth, setEditorWidth] = useState<number>(sidebarWidth);
    const [editor, setEditor] = useState<monacoTypes.editor.IStandaloneCodeEditor | null>(null);
    // ref
    const contentRef = useRef<HTMLDivElement>(null);

    const options = {
        selectOnLineNumbers: false,
    };

    const onEditorDidMount: EditorDidMount = (editorParams) => {
        setEditor(editorParams);
        // onGnomonEditorAmount(editorParams);

        editorParams.addAction({
            id: 'Run',
            label: 'Run',
            keybindings: [monacoTypes.KeyCode.F5],
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: 'Create',
            run(ed: monacoTypes.editor.ICodeEditor): void {
            }
        });

        editorParams.addAction({
            id: 'Toggle Terminal',
            label: 'Terminal',
            keybindings: [monacoTypes.KeyMod.CtrlCmd | monacoTypes.KeyMod.Shift | monacoTypes.KeyCode.Backquote],
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: 'Create',
            run(): void {
                setTerminalVisible(true);
            }
        });

        editorParams.layout();
    };


    // const getSelectedText = () => {
    //     if (!editor) {
    //         return;
    //     }
    //     const selection = editor.getSelection();
    //     if (selection) {
    //         const text = editor.getModel()?.getValueInRange(selection);
    //         if (text) {
    //             return text;
    //         }
    //     }
    // }

    const onNodeType = (nodeType: string) => {
        const value = editor?.getModel()?.getValue();;

        if (nodeType === 'kafka' && value) {
            let flow = JSON.parse(value) as Flow;
            if (flow) {
                flow.nodes.push({
                    id: utils.newUUID(),
                    position: {
                        x: 0,
                        y: 0
                    },
                    data: {
                        label: 'Kafka',
                        nodeType: NodeType.Kafka,
                    },
                    type: 'gnomon'
                })
                editor?.getModel()?.setValue(JSON.stringify(flow, undefined, 2));
                return;
            }
        }
    }

    const onToolbarClick = (nodeType: EditorToolbarControlType, props: any) => {
        if (nodeType === EditorToolbarControlType.Save) {
            const value = editor?.getModel()?.getValue();
            if (value) {
                const flow = JSON.parse(value) as Flow;
                if (flow.name) {
                    onSaveFlow(flow);
                    messageApi.success('Saved Flow');
                }
                else {
                    messageApi.error('please select one Flow first');
                }
            }
        } else if (nodeType === EditorToolbarControlType.Edit) {
            const value = editor?.getModel()?.getValue();
            if (value) {
                const flow = JSON.parse(value) as Flow;
                if (flow.name) {
                    setActiveFlow(flow);
                    navigation('/diagram')
                }
                else {
                    messageApi.error('please select one Flow first');
                }
            }
        }
    }

    useEffect(() => {
        const width = contentRef.current?.clientWidth;
        if (width) {
            setEditorWidth(width);
            editor?.layout();
        }
    }, [sidebarWidth])


    return <div className="editor-container"
        ref={contentRef}>

        {contextHolder}
        <EditorToolBarComponent onClick={onToolbarClick} isLoading={isLoading} flow={activeFlow} />

        <MonacoEditor
            editorDidMount={onEditorDidMount}
            editorWillMount={onMonacoWillMount}
            width="100%"
            height={'85vh'}
            language="json"
            theme="vs-dark"
            value={code}
            options={options} />

        <div className="terminal" style={{ width: editorWidth, display: terminalVisible ? 'block' : 'none' }} >
            <TerminalContextProvider>
                <TerminalComponent onNodeType={onNodeType} width={editorWidth} />
            </TerminalContextProvider>

            <CloseOutlined className="close-icon" onClick={() => setTerminalVisible(false)} />
        </div>
    </div>
}