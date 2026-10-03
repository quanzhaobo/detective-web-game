import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BrowserHome from './pages/BrowserHome';
import ForumHome from './pages/ForumHome';
import ForumPost from './pages/ForumPost';
import NewsHome from './pages/NewsHome';
import NewsArticle from './pages/NewsArticle';
import LifeHome from './pages/LifeHome';
import ProfilePage from './pages/ProfilePage';
import PlacePage from './pages/PlacePage';
import SearchResults from './pages/SearchResults';
import ClueBoardPage from './pages/ClueBoardPage';
import CollectionBox from './pages/CollectionBox';
import TeamWorkbench from './pages/TeamWorkbench';
import TeamInvestigation from './pages/TeamInvestigation';
import TeamSuspects from './pages/TeamSuspects';
import TeamReasoning from './pages/TeamReasoning';
import EndingPage from './pages/EndingPage';
import { RequireEnding, RequireReasoningReady, RequireTeam } from './components/RouteGuards';

/**
 * 路由表。两端（web / h5）共用这一份，
 * 桌面与移动的差异只在 shell 的导航框架，不在这里。
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Phase 1 - 浏览器首页 & 站点 */}
        <Route path="/" element={<BrowserHome />} />
        <Route path="/forum" element={<ForumHome />} />
        <Route path="/forum/post/:postId" element={<ForumPost />} />
        <Route path="/news" element={<NewsHome />} />
        <Route path="/news/article/:articleId" element={<NewsArticle />} />
        <Route path="/life" element={<LifeHome />} />
        <Route path="/life/profile/:profileId" element={<ProfilePage />} />
        <Route path="/life/place/:placeId" element={<PlacePage />} />

        {/* 搜索引擎 */}
        <Route path="/search/results" element={<SearchResults />} />

        {/* Phase 2 - 线索板 & 收集箱 */}
        <Route path="/clueboard" element={<ClueBoardPage />} />
        <Route path="/collection-box" element={<CollectionBox />} />

        {/* Phase 3 - 专案组工作台（需审核通过） */}
        <Route
          path="/team"
          element={
            <RequireTeam>
              <TeamWorkbench />
            </RequireTeam>
          }
        />
        <Route
          path="/team/investigation/:id"
          element={
            <RequireTeam>
              <TeamInvestigation />
            </RequireTeam>
          }
        />
        <Route
          path="/team/suspects"
          element={
            <RequireTeam>
              <TeamSuspects />
            </RequireTeam>
          }
        />
        {/* 最终推理还需完成全部档案与审讯 */}
        <Route
          path="/team/reasoning"
          element={
            <RequireReasoningReady>
              <TeamReasoning />
            </RequireReasoningReady>
          }
        />

        {/* 结局（需已作答） */}
        <Route
          path="/ending"
          element={
            <RequireEnding>
              <EndingPage />
            </RequireEnding>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
