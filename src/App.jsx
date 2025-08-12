import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppLayout from './Layout/Applayout';
import UserSegment from './pages/UserSegment';
import ChurnAnalysis from './pages/ChurnAnalysis';
import NudgeSuggestion from './pages/NudgeSuggestion';
import { AppContextProvider } from './context/useContenxt';
// import UserSegment from './component/Usersegment'; // ✅ Import here

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/churn-analysis" element={<ChurnAnalysis />} />
            <Route path="/user-segment" element={<UserSegment />} />
            <Route path="/nudge-suggestion" element={<NudgeSuggestion />} />
            <Route path="*" element={<div><p>No Page Found</p></div>} />
          </Route>
          {/* <Route path="/user-segments" element={<UserSegment />} /> ✅ New route */}
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;

