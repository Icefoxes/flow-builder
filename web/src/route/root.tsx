import React from "react";
import { FC } from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { BasicLayout } from "../component";


const EditorPage = React.lazy(() => import('../feature/admin/editor.page'));
const CodePage = React.lazy(() => import('../feature/admin/code.page'));
const DiagramEditPage = React.lazy(() => import('../feature/admin/diagram.edit.page'));
const ActiveDiagramEditPage = React.lazy(() => import('../feature/admin/active.diagram.page'));
const router = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout />,
        children: [
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
            },
            {
                path: 'code',
                element: <CodePage />
            }
        ]
    },
]);

export const RootRouter: FC = () => (<>
    <RouterProvider router={router} />
</>);
