import { Routes, Route } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Landing } from "@/pages/Landing";
import { ContractPage } from "@/pages/contract";
import { ValidatePage } from "@/pages/validate";
import { Footer } from "@/components/Footer";
import { ContractsPage } from "./pages/contracts";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { Toaster } from "./components/ui/toaster";
import { PublicContractPage } from "./pages/PublicContract";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingOverlay />
      <MainNav />

      <main className="flex-1 flex flex-col bg-background">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="contract">
              <Route index element={<ContractPage />} />
              <Route path=":id" element={<ContractPage />} />
              <Route path=":id/validate" element={<ValidatePage />} />
            </Route>

            <Route path="shared">
              <Route path=":publicToken" element={<PublicContractPage />} />
              <Route path=":publicToken/validate" element={<ValidatePage />} />
            </Route>

            <Route path="contracts" element={<ContractsPage />} />
          </Routes>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
