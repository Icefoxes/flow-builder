import { FC } from "react";
import { useSelector } from 'react-redux';
import { selectActiveFlow } from './adminSlice';
import { CodeViewerComponent } from "../../component";

const CodePage: FC = () => {
    const activeFlow = useSelector(selectActiveFlow);
    return <>
        {activeFlow && <CodeViewerComponent code={JSON.stringify(activeFlow, undefined, 2)} />}

    </>
}

export default CodePage;


