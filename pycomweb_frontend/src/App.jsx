import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import '../src/assets/css/layout.css';
import "../src/assets/css/advanceFilters.css";
import NavigationBar from "./components/NavigationBar";
import ViewTabBar from "./components/ViewTabBar/ViewTabs";
import Footer from "./components/Footer";
import { PyComProvider } from "./context/PyComContext";
import { HelpDataProvider } from "./context/HelpDataContext";

function App() {

  return (
    <PyComProvider>
      <HelpDataProvider>
        <div>
          <NavigationBar />
          <ViewTabBar />
          <main className="content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </HelpDataProvider>
    </PyComProvider>
  )
}

export default App
