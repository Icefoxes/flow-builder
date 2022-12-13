import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";
import { EditorWillMount } from "react-monaco-editor";
import { NodeType } from "../../model";
import utils from "../shared/util";


const FlowSchema: monacoTypes.languages.json.DiagnosticsOptions = {
    validate: true,
    schemas: [
        {
            uri: 'http://myserver/foo-schema.json', // id of the first schema
            fileMatch: ['*'],                       // associate with our model
            schema: {
                type: 'object',
                properties: {
                    id: {
                        description: "A unique identifier of the flow",
                        type: "string",
                        default: utils.newUUID()
                    },
                    name: {
                        description: "the name for a flow",
                        type: "string"
                    },
                    team: {
                        description: "the team of the flow",
                        type: "string"
                    },
                    doc: {
                        description: "the doc of the flow",
                        type: "string"
                    },
                    tag: {
                        description: "the tag of the flow",
                        type: "string"
                    },
                    nodes: {
                        description: "the nodes of the flow",
                        type: "array",
                        items: {
                            description: "List of indoor hobbies",
                            type: "object",
                            properties: {
                                id: {
                                    description: "the id of the node",
                                    type: "string",
                                    default: utils.newUUID()
                                },
                                data: {
                                    description: "the id of the node",
                                    type: "object",
                                    properties: {
                                        nodeType: {
                                            description: "the id of the node",
                                            enum: Object.values(NodeType)
                                        },
                                        label: {
                                            description: "the label of the node",
                                            type: "string"
                                        },
                                        description: {
                                            description: "the description of the node",
                                            type: "string"
                                        }
                                    }
                                },
                                position: {
                                    description: "the id of the node",
                                    type: "object",
                                    properties: {
                                        x: {
                                            description: "the id of the node",
                                            type: "number"
                                        },
                                        y: {
                                            description: "the label of the node",
                                            type: "number"
                                        },

                                    }
                                },
                                type: {
                                    description: "the type of ",
                                    type: "string",
                                    default: 'gnomon'
                                }
                            }
                        }
                    },
                    edges: {
                        description: "the edges of a flow",
                        type: "array",
                        items: {
                            description: "List of indoor hobbies",
                            type: "object",
                            properties: {
                                id: {
                                    description: "the id of the node",
                                    type: "string"
                                },
                                source: {
                                    description: "the source of edge",
                                    type: "string",

                                },
                                target: {
                                    description: "the target of edge",
                                    type: "string",

                                },
                                label: {
                                    description: "the label of edge",
                                    type: "string",
                                },
                                type: {
                                    description: "the type of ",
                                    type: "string",
                                    default: 'gnomon'
                                }
                            }
                        }
                    },
                }
            }
        }
    ]
}

export const onMonacoWillMount: EditorWillMount = (monacoParams) => {
    monacoParams.languages.registerCompletionItemProvider('json', {
        provideCompletionItems: (model: monacoTypes.editor.ITextModel, position: monacoTypes.Position, _ctx, _token: monacoTypes.CancellationToken) => {
            let last_chars = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 0,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            } as monacoTypes.Range);
            let words = last_chars.replaceAll("\t", '').split(' ');
            let activeTyping = words[words.length - 1];

            let current: monacoTypes.IRange = {
                startLineNumber: position.lineNumber,
                startColumn: position.column - activeTyping.length,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            };
            return {
                suggestions: Object.values(NodeType).filter(word => word.startsWith(activeTyping))
                    .map(word => {
                        return {
                            label: word,
                            kind: monacoParams.languages.CompletionItemKind.Keyword,
                            insertText: `${word}`,
                            range: current
                        } as monacoTypes.languages.CompletionItem
                    })
            }
        }
    });

    monacoParams.languages.json.jsonDefaults.setDiagnosticsOptions(FlowSchema);
};