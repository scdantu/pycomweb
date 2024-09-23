import { Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import '../src/assets/css/layout.css';
import "../src/assets/css/advanceFilters.css";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import { HelpDataProvider } from "./context/HelpDataContext";

function App() {

  return (
    <HelpDataProvider>
      <div>
        <NavigationBar />
        <main className="content"> 
            <Outlet /> 
        </main>
        <Footer/>
      </div>
    </HelpDataProvider>
  )
}

export default App
