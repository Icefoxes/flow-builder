import React, { FC, Suspense } from "react";
import { Spin } from "antd";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { BasicLayout } from "../component";


const EditorPage = React.lazy(() => import('../feature/admin/editor.page'));
const CodePage = React.lazy(() => import('../feature/admin/code.page'));
const DiagramEditPage = React.lazy(() => import('../feature/admin/diagram.edit.page'));
const ActiveDiagramEditPage = React.lazy(() => import('../feature/admin/active.diagram.page'));

const LoadPage: FC = () => {
    return <>
        <Spin style={{ width: '100%', height: '100%', backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }} size="large" spinning={true} />
    </>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout />,
        children: [
            {
                index: true,
                element: <>
                    <Suspense fallback={<LoadPage />}>
                        <EditorPage />
                    </Suspense>
                </>
            },
            {
                path: 'teams/:teamId/flows/:diagramId',
                element: (
                    <Suspense fallback={<LoadPage />}>
                        <DiagramEditPage />
                    </Suspense>
                )
            },
            {
                path: 'flows/:diagramId',
                element: (
                    <Suspense fallback={<LoadPage />}>
                        <DiagramEditPage />
                    </Suspense>
                )
            },
            {
                path: 'diagram',
                element: (
                    <Suspense fallback={<LoadPage />}>
                        <ActiveDiagramEditPage />
                    </Suspense>
                )
            },
            {
                path: 'code',
                element: <Suspense fallback={<LoadPage />}>
                    <CodePage />
                </Suspense>
            }
        ]
    },
]);

export const RootRouter: FC = () => (<>
    <RouterProvider router={router} />
</>);
