import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { LoadingOverlay, SuspenseFallback } from "./components/LoadingOverlay";
import { Toaster } from "./components/ui/toaster";

const Landing = lazy(() =>
  import("@/pages/Landing").then((module) => ({
    default: module.Landing,
  }))
);
const ContractPage = lazy(() =>
  import("@/pages/contract").then((module) => ({
    default: module.ContractPage,
  }))
);
const ValidatePage = lazy(() =>
  import("@/pages/validate").then((module) => ({
    default: module.ValidatePage,
  }))
);
const ContractsPage = lazy(() =>
  import("./pages/contracts").then((module) => ({
    default: module.ContractsPage,
  }))
);
const PublicContractPage = lazy(() =>
  import("./pages/PublicContract").then((module) => ({
    default: module.PublicContractPage,
  }))
);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingOverlay />
      <MainNav />

      <main className="flex-1 flex flex-col bg-background">
        <div className="flex-1">
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route path="contract">
                <Route index element={<ContractPage />} />
                <Route path=":id" element={<ContractPage />} />
                <Route path=":id/validate" element={<ValidatePage />} />
              </Route>

              <Route path="shared">
                <Route path=":publicToken" element={<PublicContractPage />} />
                <Route
                  path=":publicToken/validate"
                  element={<ValidatePage />}
                />
              </Route>

              <Route path="contracts" element={<ContractsPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
