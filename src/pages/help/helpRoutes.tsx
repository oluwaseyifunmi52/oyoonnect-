import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { HelpLandingPage } from './HelpLandingPage'
import { HelpRequestsPage } from './HelpRequestsPage'
import { SupportRequestDetailsPage } from './SupportRequestDetailsPage'
import { RequestHelpPage } from './RequestHelpPage'
import { RequestSuccessPage } from './RequestSuccessPage'
import { HelpLayout } from './HelpLayout'

export const helpRoutes: RouteObject[] = [
  {
    path: '/community/help',
    element: <HelpLayout />,
    children: [
      { path: '', element: <HelpLandingPage /> },
      { path: 'categories', element: <HelpLandingPage /> },
      { path: 'requests', element: <HelpRequestsPage /> },
      { path: 'requests/:id', element: <SupportRequestDetailsPage /> },
      { path: 'request/:id', element: <SupportRequestDetailsPage /> },
      {
        path: 'request',
        element: <RequestHelpPage />,
      },
      {
        path: 'request/success',
        element: <RequestSuccessPage />,
      },
    ],
  },
]