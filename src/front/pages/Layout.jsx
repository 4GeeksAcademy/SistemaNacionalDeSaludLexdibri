
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <ScrollToTop>
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

