import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
const Index = lazy(() => import("../pages/index/Index"));
const AdminLogin = lazy(() => import("../pages/admin/Login"));
const OnlineVideo = lazy(() => import("../pages/index/OnlineVideo"));
const Error_404 = lazy(() => import("../pages/Error"));
const LiveRoom = lazy(() => import("../pages/index/LiveRoom"));
const VideoPlayer = lazy(() => import("../pages/player/VideoPlayer"));
const LivePlayer = lazy(() => import("../pages/player/LivePlayer"));
const AdminUI = lazy(() => import("../pages/admin/AdminUI"));
const VideoManager = lazy(() => import("../pages/admin/mediaManage/VideoManage"));
const LiveManager = lazy(() => import("../pages/admin/mediaManage/LiveManager"));
const UserSetting = lazy(() => import("../pages/admin/functions/UserSetting"));
const NoticePad = lazy(() => import("../pages/admin/functions/NoticePad"));
const SystemSetting = lazy(() => import("../pages/admin/functions/SystemSetting"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/onlineVideo" />,
  },
  {
    path: "/",
    element: (
      <Suspense>
        <Index />
      </Suspense>
    ),
    children: [
      {
        path: "onlineVideo",
        element: (
          <Suspense>
            <OnlineVideo />
          </Suspense>
        ),
      },
      {
        path: "liveRoom",
        element: (
          <Suspense>
            <LiveRoom />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/videoPlayer",
    element: (
      <Suspense>
        <VideoPlayer />
      </Suspense>
    ),
  },
  {
    path: "/livePlayer",
    element: (
      <Suspense>
        <LivePlayer />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: <Navigate replace to="/admin/videoManager" />,
  },
  {
    path: "/admin",
    element: (
      <Suspense>
        <AdminUI />
      </Suspense>
    ),
    children: [
      {
        path: "videoManager",
        element: (
          <Suspense>
            <VideoManager />
          </Suspense>
        ),
      },
      {
        path: "liveManager",
        element: (
          <Suspense>
            <LiveManager />
          </Suspense>
        ),
      },
      {
        path: "userSetting",
        element: (
          <Suspense>
            <UserSetting />
          </Suspense>
        ),
      },
      {
        path: "noticePad",
        element: (
          <Suspense>
            <NoticePad />
          </Suspense>
        ),
      },
      {
        path: "systemSetting",
        element: (
          <Suspense>
            <SystemSetting />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense>
        <Error_404 />
      </Suspense>
    ),
  },
]);

export default router;
