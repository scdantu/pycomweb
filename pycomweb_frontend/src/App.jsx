import React from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import '../src/assets/css/layout.css';
import "../src/assets/css/advanceFilters.css";
import NavigationBar from "./components/NavigationBar";
import ViewTabBar from "./components/ViewTabBar/ViewTabs";
import Footer from "./components/Footer";
import { PyComProviders } from "./context/PyComProviders";

import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }) {
  return <div>ERROR: {error.message}</div>;
}



function App() {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PyComProviders>
        <React.Fragment>
          <NavigationBar />
          <ViewTabBar />
          <main className="content">
            <Outlet />
          </main>
          <Footer />
        </React.Fragment>
      </PyComProviders>
    </ErrorBoundary>
  )
}

export default App
