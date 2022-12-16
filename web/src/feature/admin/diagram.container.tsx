import { FC } from "react"
import { ReactFlowProvider } from "reactflow";

import { DiagramComponent } from "../../component"
import { useGetFlowByIdQuery, useUpdateFlowMutation } from "../../service"
import { Flow } from "../../model";

export const ActiveDiagramContent: FC<{ flow: Flow, isLoading?: boolean }> = ({ flow, isLoading }) => {
    const [updateFlow] = useUpdateFlowMutation();

    return <>
        <ReactFlowProvider>
            {(!isLoading && flow) && <>
                <DiagramComponent key={flow.id} flow={flow} onSave={(f) => updateFlow({ flow: f })} />
            </>}
        </ReactFlowProvider>
    </>
}

export const DiagramContent: FC<{ diagramId: string }> = ({ diagramId }) => {
    const { data, isLoading } = useGetFlowByIdQuery({ id: diagramId });
    return <ActiveDiagramContent flow={data as Flow} isLoading={isLoading} />
}





