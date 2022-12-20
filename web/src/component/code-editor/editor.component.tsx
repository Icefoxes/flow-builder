import { FC, useEffect, useReducer, useRef, useState } from "react"
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
import { Flow } from "../../model";
import utils from "../shared/util";
import { EditorActionKind, visibleReducer } from "./editor.reducer";


export interface CodeEditProps {
    code: string;
    sidebarWidth: number;
    onSaveFlow: (flow: Flow) => void,
    isLoading: boolean,
    activeFlow: Flow | null,
    setActiveFlow: (flow: Flow) => void,
}

export const CodeEditComponent: FC<CodeEditProps> = ({ code, onSaveFlow, isLoading, activeFlow, sidebarWidth, setActiveFlow }) => {
    // hooks
    const navigation = useNavigate();
    // ref
    const contentRef = useRef<HTMLDivElement>(null);

    const [messageApi, contextHolder] = message.useMessage();
    // state
    const [state, dispatch] = useReducer(visibleReducer, { visible: true });
    const [editorWidth, setEditorWidth] = useState<number>(sidebarWidth);
    const [editor, setEditor] = useState<monacoTypes.editor.IStandaloneCodeEditor | null>(null);


    const options = {
        selectOnLineNumbers: false,
    };

    const onEditorDidMount: EditorDidMount = (editorParams) => {
        setEditor(editorParams);

        editorParams.addAction({
            id: 'Save',
            label: 'Save',
            keybindings: [monacoTypes.KeyMod.CtrlCmd | monacoTypes.KeyCode.KeyS],
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: 'Gnomon',
            run(ed: monacoTypes.editor.ICodeEditor): void {
                const value = ed.getModel()?.getValue();
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
            }
        });

        editorParams.addAction({
            id: 'Toggle Terminal',
            label: 'Terminal',
            keybindings: [monacoTypes.KeyMod.CtrlCmd | monacoTypes.KeyMod.Shift | monacoTypes.KeyCode.Backquote],
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: 'Gnomon',
            run(): void {
                dispatch({ type: EditorActionKind.TOGGLE });
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
        const editText = editor?.getModel()?.getValue();;

        if (editText && nodeType) {
            const found = utils.getNodeMetaData().find(f => f.toLowerCase() === nodeType.toLowerCase());
            if (found) {
                let flow = JSON.parse(editText) as Flow;
                if (flow) {
                    flow.nodes.push({
                        id: utils.newUUID(),
                        position: {
                            x: 0,
                            y: 0
                        },
                        data: {
                            label: `New ${found}`,
                            nodeType: found,
                        },
                        type: 'gnomon'
                    })
                    editor?.getModel()?.setValue(JSON.stringify(flow, undefined, 2));
                }
            }
        }
    }

    const onToolbarClick = (nodeType: EditorToolbarControlType, props?: any) => {
        switch (nodeType) {
            case EditorToolbarControlType.Save: {
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
                break;
            }
            case EditorToolbarControlType.GoToDiagram: {
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
                break
            }
        }
    }

    useEffect(() => {
        const width = contentRef.current?.clientWidth;
        if (width) {
            setEditorWidth(width);
            editor?.layout();
        }
    }, [sidebarWidth, setEditorWidth, editor])


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

        <div className="terminal" style={{ width: editorWidth, display: state.visible ? 'block' : 'none' }} >
            <TerminalContextProvider>
                <TerminalComponent onNodeType={onNodeType} width={editorWidth} />
            </TerminalContextProvider>

            <CloseOutlined className="close-icon" onClick={() => dispatch({ type: EditorActionKind.TOGGLE })} />
        </div>
    </div>
}