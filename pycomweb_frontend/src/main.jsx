import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from './App.jsx';
import Home from "./pages/Home.jsx";
import BiologicalProcesses from "./pages/helpData/BiologicalProcesses.jsx";
import Cofactors from "./pages/helpData/Cofactors.jsx";
import CellularComponents from './pages/helpData/CellularComponents.jsx';
import Organisms from './pages/helpData/Organisms.jsx';
import Diseases from './pages/helpData/Diseases.jsx';
import Domains from './pages/helpData/Domains.jsx';
import Ligands from './pages/helpData/Ligands.jsx';
import MolecularFunctions from './pages/helpData/MolecularFunctions.jsx';
import PTM from './pages/helpData/PTM.jsx';
import DevelopmentalStages from './pages/helpData/DevelopmentalStages.jsx';
import ProteinDetail from './pages/ProteinDetail.jsx';
import PDB from './pages/PDB/PDB.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="biological_processes" element={<BiologicalProcesses />} />
      <Route path="cellular_components" element={<CellularComponents />} />
      <Route path="cofactors" element={<Cofactors />} />
      <Route path="diseases" element={<Diseases />} />
      <Route path="developmental_stages" element={<DevelopmentalStages />} />
      <Route path="domains" element={<Domains />} />
      <Route path="ligands" element={<Ligands />} />
      <Route path="molecular_functions" element={<MolecularFunctions />} />
      <Route path="Organisms" element={<Organisms />} />
      <Route path="ptm" element={<PTM />} />
      <Route path="/protein/:uniprot_id" element={<ProteinDetail />} />
      <Route path="pdb" element={<PDB />} />
    </Route>
  )
);

console.log("App is bootstrapped")
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
