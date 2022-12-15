import { FC } from "react";
import { useSelector } from "react-redux";

import { Flow } from "../../model";
import { selectActiveFlow } from "./adminSlice";
import { ActiveDiagramContent } from "./diagram.container";

const ActiveDiagramEditPage: FC = () => {
    const activeFlow = useSelector(selectActiveFlow);
    return <>
        <ActiveDiagramContent flow={activeFlow as Flow} />
    </>
};

export default ActiveDiagramEditPage;