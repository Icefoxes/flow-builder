import { FC } from "react";
import { useSelector } from "react-redux";
import { NodeTypeTab } from "../../component";
import { selectNodeMetaData } from "./adminSlice";

const MetaPage: FC = () => {
    const meta = useSelector(selectNodeMetaData);
    return <>
        <NodeTypeTab items={meta} />
    </>
}
export default MetaPage;