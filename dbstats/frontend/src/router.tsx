import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import { SuspenseLoader } from 'src/components/SuspenseLoader';
import Charts from "./content/applications/Charts";

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader success={false} />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// Applications

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Charts />
      },
      {
        path: '/api/hassio_ingress/*',
        element: <Charts />
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
];

export default routes;
