import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
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

        {/* Phase 3 - 专案组工作台 */}
        <Route path="/team" element={<TeamWorkbench />} />
        <Route path="/team/investigation/:id" element={<TeamInvestigation />} />
        <Route path="/team/suspects" element={<TeamSuspects />} />
        <Route path="/team/reasoning" element={<TeamReasoning />} />

        {/* 结局 */}
        <Route path="/ending" element={<EndingPage />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}