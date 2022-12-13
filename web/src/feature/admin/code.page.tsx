import { FC } from "react";
import { useSelector } from 'react-redux';
import { selectActiveFlow } from './adminSlice';
import { CodeViewerComponent } from "../../component";

export const CodePage: FC = () => {
    const activeFlow = useSelector(selectActiveFlow);
    return <>
        {activeFlow && <CodeViewerComponent code={JSON.stringify(activeFlow, undefined, 2)} />}

    </>
}


