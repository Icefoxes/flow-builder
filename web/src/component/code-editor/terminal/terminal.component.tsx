import { FC, useState } from "react"
import { ReactTerminal } from "react-terminal";
import { Resizable } from 're-resizable';

import './terminal.component.scss';

interface TerminalProps {
    onNodeType: (nodeType: string) => void
    width: number;
}

export const TerminalComponent: FC<TerminalProps> = ({ onNodeType, width }) => {
    const [clientHeight, setClientHeight] = useState<number>(window.innerHeight * 0.2);
    const commands = {
        node: (nodeType: string) => {
            onNodeType(nodeType);
            return 'create succeed'
        },
        help: (
            <span>
                <strong>clear</strong> - clears the console. <br />
                <strong>node &lt;NodeType&gt;</strong> - create new node. <br />
            </span>
        )
    };
    const welcome = (
        <span>
            Welcome to Gnomon, type "help" for all available commands.<br />
        </span>
    )
    return <>
        <Resizable
            className="terminal-resizable"
            defaultSize={{
                width: '100%',
                height: '20vh',
            }}
            style={{
                overflow: 'hidden'
            }}
            minHeight='15vh'
            maxHeight={'100vh'}
            onResizeStop={(_event, _direction, elementRef, _delta) => {
                setClientHeight(elementRef.clientHeight);
            }}
            enable={{
                top: true,
            }}>
            <ReactTerminal
                themes={{
                    vscode: {
                        themeBGColor: "#1E1E1E",
                        themeToolbarColor: "#DBDBDB",
                        themeColor: "#CCCCCC",
                        themePromptColor: "#a917a8"
                    }
                }}
                welcomeMessage={welcome}
                theme='vscode'
                height={clientHeight}
                width={width}
                showControlBar={false}
                showControlButtons={false}
                commands={commands}
            />
        </Resizable>
    </>
}