import { FC } from "react";
import { Result, Button } from "antd";
import { useParams } from "react-router-dom";
import { DiagramContent } from "./diagram.container";


const DiagramEditPage: FC = () => {
    const { diagramId } = useParams();
    return diagramId ? <DiagramContent diagramId={diagramId} /> : <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
    />
}

export default DiagramEditPage;