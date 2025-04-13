import { Routes, Route } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Landing } from "@/pages/Landing";
import { ContractPage } from "@/pages/contract";
import { ValidatePage } from "@/pages/validate";
import { Footer } from "@/components/Footer";
import { PrivateRoute } from "./components/PrivateRoute";
import { ContractsPage } from "./pages/contracts";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingOverlay />
      <MainNav />
      <main className="flex-1 flex flex-col bg-background">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/contract" element={<ContractPage />} />
            <Route path="/contract/:id" element={<ContractPage />} />
            <Route path="/contract/:id/validate" element={<ValidatePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/contracts" element={<ContractsPage />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
