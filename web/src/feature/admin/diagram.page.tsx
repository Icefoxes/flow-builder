
import { FC } from "react"
import { Spin, Result, Button } from "antd";
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useSelector } from "react-redux";
import { DiagramComponent } from "../../component"
import { useGetFlowByIdQuery, useUpdateFlowMutation } from "../../service"
import { Flow } from "../../model";
import { selectActiveFlow } from "./adminSlice";


const ActiveDiagramContent: FC<{ flow: Flow, isLoading?: boolean }> = ({ flow, isLoading }) => {
    const [updateFlow, { isLoading: uploadisLoading }] = useUpdateFlowMutation();

    return <>
        <ReactFlowProvider>
            {uploadisLoading && <Spin tip='saving ...' />}
            {(!isLoading && flow) && <>

                <DiagramComponent flow={flow}
                    onSave={(flow) => {
                        updateFlow({ flow });
                    }} />
            </>}
        </ReactFlowProvider>

    </>
}

const DiagramContent: FC<{ diagramId: string }> = ({ diagramId }) => {
    const { data, isLoading } = useGetFlowByIdQuery({ id: diagramId });
    return <ActiveDiagramContent flow={data as Flow} isLoading={isLoading} />
}


export const DiagramEditPage: FC = () => {
    const { diagramId } = useParams();
    return <>
        {(diagramId) && <DiagramContent diagramId={diagramId} />}

        {!((diagramId)) && <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">Back Home</Button>}
        />}
    </>
}

export const ActiveDiagramEditPage: FC = () => {
    const activeFlow = useSelector(selectActiveFlow);
    return <>
        <ActiveDiagramContent flow={activeFlow as Flow} />
    </>
}