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
import Discernment from "@/pages/Discernment";
import NotFound from "@/pages/NotFound";
import Sitemap from "@/pages/Sitemap";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Exported so the SSG build (scripts/ssr-entry.jsx) can render each route
// to static HTML at build time without pulling in BrowserRouter.
export function AppShell() {
    const { pathname } = useLocation();
    useDocumentTitle();
    // Pages whose FIRST band is navy — nav needs a light color from the start.
    const navyStart = pathname === "/" || pathname === "/connect";

    return (
        <div className="min-h-screen bg-cream text-navy">
            <Nav variant={navyStart ? "navy" : "cream"} />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<WorkDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/about/discernment" element={<Discernment />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/writing/:slug" element={<WritingDetail />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;
