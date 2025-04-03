import { Routes, Route } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Landing } from "@/pages/Landing";
import { ContractPage } from "@/pages/contract";
import { ValidatePage } from "@/pages/validate";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 flex flex-col bg-background">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/contract" element={<ContractPage />} />
            <Route path="/contract/:id" element={<ContractPage />} />
            <Route path="/contract/:id/validate" element={<ValidatePage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
