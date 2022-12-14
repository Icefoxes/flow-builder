import { memo } from 'react';
import { getBezierPath, EdgeProps } from 'reactflow';
import "./edge.scss";

const foreignObjectSize = 40;


export const UserDefinedEdge = memo<EdgeProps>(({
    id,
    label,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const onEdgeClick = (evt: any, id: any) => {
        evt.stopPropagation();
        alert(`remove ${id}`);
    };
    return <>
        <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
        />
        <foreignObject
            width={foreignObjectSize}
            height={foreignObjectSize}
            x={labelX - foreignObjectSize / 2}
            y={labelY - foreignObjectSize / 2}
            className="edgebutton-foreignobject"
            requiredExtensions="http://www.w3.org/1999/xhtml"
        >
            <div>
                <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
                    ×
                </button>
            </div>
        </foreignObject>
    </>
});