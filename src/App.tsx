import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineIndicator } from "@/components/OfflineIndicator";

// Pages
import { VoiceAssistant } from "@/pages/VoiceAssistant";
import { HealthAssistant } from "@/pages/HealthAssistant";
import { EducationAssistant } from "@/pages/EducationAssistant";
import { FinanceAssistant } from "@/pages/FinanceAssistant";
import { EntertainmentAssistant } from "@/pages/EntertainmentAssistant";
import { Lessons } from "@/pages/Lessons";
import { QueryHistory } from "@/pages/QueryHistory";
import { Profile } from "@/pages/Profile";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { IVRInfo } from "@/pages/IVRInfo";
import { WhatsAppInfo } from "@/pages/WhatsAppInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Protected Routes */}
              <Route index element={
                <ProtectedRoute>
                  <VoiceAssistant />
                </ProtectedRoute>
              } />
              <Route path="assistant" element={
                <ProtectedRoute>
                  <VoiceAssistant />
                </ProtectedRoute>
              } />
              <Route path="assistant/health" element={
                <ProtectedRoute>
                  <HealthAssistant />
                </ProtectedRoute>
              } />
              <Route path="assistant/education" element={
                <ProtectedRoute>
                  <EducationAssistant />
                </ProtectedRoute>
              } />
              <Route path="assistant/finance" element={
                <ProtectedRoute>
                  <FinanceAssistant />
                </ProtectedRoute>
              } />
              <Route path="assistant/entertainment" element={
                <ProtectedRoute>
                  <EntertainmentAssistant />
                </ProtectedRoute>
              } />
              <Route path="lessons" element={
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              } />
              <Route path="history" element={
                <ProtectedRoute>
                  <QueryHistory />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="ivr-info" element={<IVRInfo />} />
              <Route path="whatsapp-info" element={<WhatsAppInfo />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
