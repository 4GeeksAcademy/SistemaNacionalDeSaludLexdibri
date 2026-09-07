
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LanguageTranslator } from "../i18n";

export const Layout = () => {
    return (
        <ScrollToTop>
            <LanguageTranslator />
            <div className="app-background">
                <Navbar />

                <main className="app-content">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </ScrollToTop>
    );
};

