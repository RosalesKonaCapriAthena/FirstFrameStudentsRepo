import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProviderWrapper } from "./lib/clerk";
import { ElementLight } from "./screens/ElementLight";
import { About } from "./screens/About";
import { ForStudents } from "./screens/ForStudents";
import { ForOrganizers } from "./screens/ForOrganizers";
import { Portfolio } from "./screens/Portfolio";
import { Auth } from "./screens/Auth";
import { Profile } from "./screens/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Contact } from "./screens/Contact";
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ClerkProviderWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<ElementLight />} />
          <Route path="/about" element={<About />} />
          <Route path="/students" element={
            <ProtectedRoute>
              <ForStudents />
            </ProtectedRoute>
          } />
          <Route path="/organizers" element={
            <ProtectedRoute requiredUserType="organizer">
              <ForOrganizers />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={<Portfolio />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ClerkProviderWrapper>
  </StrictMode>,
);
