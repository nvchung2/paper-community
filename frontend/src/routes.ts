import { lazy } from "react";

const HomePage = lazy(() => import("features/home/HomePage"));
const SearchPage = lazy(() => import("features/search/SearchPage"));
const LoginPage = lazy(() => import("features/auth/LoginPage"));
const NotificationPage = lazy(
  () => import("features/notification/NotificationPage")
);
const ProfilePage = lazy(() => import("features/profile/pages/ProfilePage"));
const EditProfilePage = lazy(
  () => import("features/profile/pages/EditProfilePage")
);
const ArticleEditorPage = lazy(
  () => import("features/article/pages/ArticleEditorPage")
);
const ArticlePage = lazy(() => import("features/article/pages/ArticlePage"));
const ReadingListPage = lazy(
  () => import("features/readling-list/ReadingListPage")
);
const TagListPage = lazy(() => import("features/tag/pages/TagListPage"));
const TagPage = lazy(() => import("features/tag/pages/TagPage"));
const LoginCallBack = lazy(() => import("features/auth/LoginCallback"));
const routes = [
  {
    path: ["/", "/feed", "/top", "/latest"],
    exact: true,
    component: HomePage,
  },
  {
    path: "/search",
    exact: true,
    component: SearchPage,
  },
  {
    path: "/notification",
    exact: true,
    component: NotificationPage,
    isProtected: true,
  },
  {
    path: "/login",
    exact: true,
    component: LoginPage,
  },
  {
    path: "/login/callback",
    exact: true,
    component: LoginCallBack,
  },
  {
    path: "/article/:action(new|edit)/:id?",
    exact: true,
    component: ArticleEditorPage,
    isProtected: true,
  },
  {
    path: "/profile/edit",
    exact: true,
    component: EditProfilePage,
    isProtected: true,
  },
  {
    path: "/profile/:id/:list(articles|comments|followers)",
    exact: true,
    component: ProfilePage,
  },
  {
    path: "/article/:id",
    exact: true,
    component: ArticlePage,
  },
  {
    path: "/reading-list",
    exact: true,
    component: ReadingListPage,
    isProtected: true,
  },
  {
    path: "/tag",
    exact: true,
    component: TagListPage,
  },
  {
    path: "/tag/:id",
    exact: true,
    component: TagPage,
  },
];
export default routes;
