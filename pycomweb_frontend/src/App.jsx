import React from "react";
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
import { PyComProviders } from "./context/PyComProviders";


function App() {

  return (
    <PyComProviders>
      <PyComProvider>
      <HelpDataProvider>
        <React.Fragment>
          <NavigationBar />
            <ViewTabBar />
              <main className="content">
              <Outlet />
              </main>
            <Footer />
        </React.Fragment>
      </HelpDataProvider>
      </PyComProvider>
    </PyComProviders>
  )
}

export default App
