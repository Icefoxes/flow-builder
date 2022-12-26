import { FC, useEffect } from "react";
import { message } from "antd";
import { ReactFlowProvider } from "reactflow";

import { DiagramComponent } from "../../component";
import { useGetFlowByAliasQuery, useUpdateFlowMutation } from "../../service";
import { Flow } from "../../model";


export const ActiveDiagramContent: FC<{ flow: Flow, isLoading?: boolean }> = ({ flow, isLoading }) => {
    const [updateFlow, { isSuccess, error }] = useUpdateFlowMutation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (isSuccess) {
            messageApi.success('saved flow');
        }
        if (error) {
            messageApi.error(`saved flow Failed due to ${(error as any)?.data || 'unkown issue'}`);
        }
    }, [messageApi, isSuccess, error]);

    return <>
        <ReactFlowProvider>
            {(!isLoading && flow) && <>
                <DiagramComponent key={flow._id} flow={flow} updateFlow={updateFlow} />
            </>}
        </ReactFlowProvider>
        {contextHolder}
    </>
}

export const DiagramContent: FC<{ diagramId: string }> = ({ diagramId }) => {
    const { data, isLoading } = useGetFlowByAliasQuery(diagramId);
    return <ActiveDiagramContent flow={data as Flow} isLoading={isLoading} />
}





