import { FC } from "react"
import { Spin } from "antd";
import { ReactFlowProvider } from "reactflow";

import { DiagramComponent } from "../../component"
import { useGetFlowByIdQuery, useUpdateFlowMutation } from "../../service"
import { Flow } from "../../model";

export const ActiveDiagramContent: FC<{ flow: Flow, isLoading?: boolean }> = ({ flow, isLoading }) => {
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

export const DiagramContent: FC<{ diagramId: string }> = ({ diagramId }) => {
    const { data, isLoading } = useGetFlowByIdQuery({ id: diagramId });
    return <ActiveDiagramContent flow={data as Flow} isLoading={isLoading} />
}





