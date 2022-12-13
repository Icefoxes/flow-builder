import { FC, useState } from "react"
import { Layout } from "antd"
import { Resizable } from "re-resizable";
import { useDispatch, useSelector } from "react-redux";

import { CodeEditComponent, CodeEditProps, EditorSidebarComponent, TeamCreateModal, TEAM_SIDEBAR_MENU } from "../../component/code-editor"
import { selectActiveFlow, selectTeams, setActiveFlow } from "./adminSlice";
import { useCreateTeamMutation, useGetTeamsQuery, useUpdateFlowMutation } from "../../service";
import './editor.page.scss';
import { useContextMenu } from "react-contexify";

const { Sider } = Layout;

export const EditorPage: FC = () => {
    const disptach = useDispatch();
    useGetTeamsQuery({});
    const activeFlow = useSelector(selectActiveFlow);
    const teams = useSelector(selectTeams);

    const [teamCreateVisible, setTeamCreateVisible] = useState<boolean>(false);
    const [createTeam] = useCreateTeamMutation();
    const { show: showTeamContextMenu } = useContextMenu({
        id: TEAM_SIDEBAR_MENU
    });

    const [updateFlow, { isLoading }] = useUpdateFlowMutation();
    const [sidebarWidth, setSidebarWidth] = useState<number>(0);
    const props: CodeEditProps = {
        code: JSON.stringify(activeFlow || {}, undefined, 2),
        onSaveFlow: (flow) => {
            updateFlow({ flow });
        },
        sidebarWidth,
        isLoading,
        activeFlow,
        setActiveFlow: (flow) => disptach(setActiveFlow(flow))
    }

    return <Layout className="edit-page-root">
        <Resizable
            defaultSize={{
                width: '15vw',
                height: '100%',
            }}
            minWidth='10vw'
            maxWidth='20vw'
            onResize={e => {
                setSidebarWidth((e.target as HTMLElement).clientWidth);
            }}
            onResizeStop={(_e, _direction, ele) => {
                setSidebarWidth(ele.clientWidth);
            }}
            enable={{
                right: true
            }}>
            <Sider width={'100%'} className="edit-page-sidebar" onContextMenu={e => {
                if (teams && teams.length === 0) {
                    showTeamContextMenu({
                        event: e,
                        props: { source: 'workspace' }
                    })
                }
            }}>
                {teams && <EditorSidebarComponent teams={teams} />}

            </Sider>
        </Resizable>


        <Layout className="editor-page-content">
            <CodeEditComponent {...props} />
        </Layout>

        <TeamCreateModal isModalOpen={teamCreateVisible} handleOk={team => {
            createTeam(team);
            setTeamCreateVisible(false);
        }} />
        <div className="status-bar">
        </div>
    </Layout>
}
