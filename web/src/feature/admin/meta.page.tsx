import { FC } from "react";
import { useSelector } from "react-redux";
import { NodeTypeTab } from "../../component";
import { useGetMetaQuery } from "../../service";
import { selectNodeMetaData } from "./adminSlice";

const MetaPage: FC = () => {
    useGetMetaQuery();
    const meta = useSelector(selectNodeMetaData);
    return <>
        <NodeTypeTab items={meta} />
    </>
}
export default MetaPage;