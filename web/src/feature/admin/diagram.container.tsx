import { FC } from "react"
import { ReactFlowProvider } from "reactflow";

import { DiagramComponent } from "../../component"
import { useGetFlowByAliasQuery } from "../../service"
import { Flow } from "../../model";

export const ActiveDiagramContent: FC<{ flow: Flow, isLoading?: boolean }> = ({ flow, isLoading }) => {


    return <>
        <ReactFlowProvider>
            {(!isLoading && flow) && <>
                <DiagramComponent key={flow._id} flow={flow} />
            </>}
        </ReactFlowProvider>
    </>
}

export const DiagramContent: FC<{ diagramId: string }> = ({ diagramId }) => {
    const { data, isLoading } = useGetFlowByAliasQuery({ alias: diagramId });
    return <ActiveDiagramContent flow={data as Flow} isLoading={isLoading} />
}





