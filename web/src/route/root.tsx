import { FC } from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { BasicLayout } from "../component";
import { DiagramEditPage, EditorPage, ActiveDiagramEditPage } from "../feature";

const router = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout />,
        children: [
            {
                path: 'editor',
                index: true,
                element: <EditorPage />,
            },
            {
                index: true,
                element: <EditorPage />
            },
            {
                path: 'teams/:teamId/flows/:diagramId',
                element: <DiagramEditPage />,
            },
            {
                path: 'diagram',
                element: <ActiveDiagramEditPage />
            }
        ]
    },
]);

export const RootRouter: FC = () => (<>
    <RouterProvider router={router} />
</>);
