import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import WorkDetail from "@/pages/WorkDetail";
import About from "@/pages/About";
import Writing from "@/pages/Writing";
import WritingDetail from "@/pages/WritingDetail";
import Connect from "@/pages/Connect";

function Shell() {
    const { pathname } = useLocation();
    // Only /connect starts on navy now — home hero moved to cream to match other page heros.
    const navyStart = pathname === "/connect";
    const hideFooter = pathname === "/connect";

    return (
        <div className="min-h-screen bg-cream text-navy">
            <Nav variant={navyStart ? "navy" : "cream"} />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<WorkDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/writing/:slug" element={<WritingDetail />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="*" element={<Home />} />
            </Routes>
            {!hideFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    );
}

export default App;
