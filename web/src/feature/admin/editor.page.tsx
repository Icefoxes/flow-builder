import { FC, useEffect, useState } from "react"
import { Layout, message } from "antd"
import { Resizable } from "re-resizable";
import { useDispatch, useSelector } from "react-redux";
import { useContextMenu } from "react-contexify";

import { CodeEditComponent, CodeEditProps, EditorSidebarComponent, TeamCreateModal, TEAM_SIDEBAR_MENU } from "../../component/code-editor"
import { selectActiveFlow, selectFlows, selectTeams, setActiveFlow } from "./adminSlice";
import { useCreateFlowMutation, useCreateTeamMutation, useDeleteFlowMutation, useDeleteTeamMutation, useUpdateFlowMutation, useUpdateTeamMutation } from "../../service";
import './editor.page.scss';
import { Team } from "../../model";

const { Sider } = Layout;

const EditorPage: FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const disptach = useDispatch();
    // selectors
    const activeFlow = useSelector(selectActiveFlow);
    const teams = useSelector(selectTeams);
    const flows = useSelector(selectFlows);
    // state
    const [teamCreateModalVisible, setTeamCreateModalVisible] = useState<boolean>(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(0);
    // service
    const [createTeam, { isLoading: CreateTeamisLoading, error: CreateTeamError }] = useCreateTeamMutation();
    const [updateTeam, { isLoading: UpdateTeamisLoading, error: UpdateTeamError }] = useUpdateTeamMutation();
    const [deleteTeam, { isLoading: DeleteTeamisLoading, error: DeleteTeamError }] = useDeleteTeamMutation();
    const [createFlow, { isLoading: CreateFlowisLoading, error: CreateFlowError }] = useCreateFlowMutation();
    const [updateFlow, { isLoading: UpdateFlowisLoading, error: UpdateFlowError }] = useUpdateFlowMutation();
    const [deleteFlow, { isLoading: DeleteFlowisLoading, error: DeleteFlowError }] = useDeleteFlowMutation();

    const isLoading = CreateTeamisLoading || UpdateTeamisLoading || DeleteTeamisLoading || CreateFlowisLoading || UpdateFlowisLoading || DeleteFlowisLoading;
    const error = CreateTeamError || UpdateTeamError || DeleteTeamError || CreateFlowError || UpdateFlowError || DeleteFlowError;
    // context menu
    const { show: showTeamContextMenu } = useContextMenu({
        id: TEAM_SIDEBAR_MENU
    });

    const { createdAt, updatedAt, __v, ...restProps } = activeFlow || {};

    const props: CodeEditProps = {
        code: JSON.stringify(restProps || {}, undefined, 2),
        onSaveFlow: updateFlow,
        sidebarWidth,
        isLoading,
        activeFlow,
        setActiveFlow: (flow) => disptach(setActiveFlow(flow))
    }

    const onTeamCreateModal = (team: Team) => {
        createTeam(team);
        setTeamCreateModalVisible(false);
    }

    useEffect(() => {
        if (error) {
            messageApi.error((error as any)?.data?.message || 'unkonwn issue')
        }
    }, [messageApi, error]);

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
                showTeamContextMenu({
                    event: e,
                    props: { source: 'workspace' }
                });
                e.stopPropagation();
            }}>
                {(teams && flows) && <EditorSidebarComponent
                    createTeam={createTeam}
                    updateTeam={updateTeam}
                    deleteTeam={deleteTeam}
                    createFlow={createFlow}
                    deleteFlow={deleteFlow}
                    teams={teams}
                    flows={flows}
                    activeFlow={activeFlow} />}

            </Sider>
        </Resizable>


        <Layout className="editor-page-content">
            <CodeEditComponent {...props} />
        </Layout>

        <TeamCreateModal
            activeTeam={null}
            isModalOpen={teamCreateModalVisible}
            handleOk={onTeamCreateModal}
            toggleVisible={() => setTeamCreateModalVisible(!teamCreateModalVisible)} />

        <div className="status-bar">
        </div>
        {contextHolder}
    </Layout>
}

export default EditorPage;