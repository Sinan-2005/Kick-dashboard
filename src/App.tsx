import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { CustomersPage } from "./pages/CustomersPage";
import { CouponsPage } from "./pages/CouponsPage";
import { MediaPage } from "./pages/MediaPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { SubscribersPage } from "./pages/SubscribersPage";
import { SupportDashboardPage } from "./pages/SupportDashboardPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { MessagesPage } from "./pages/MessagesPage";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/customers" 
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/coupons" 
          element={
            <ProtectedRoute>
              <CouponsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/media" 
          element={
            <ProtectedRoute>
              <MediaPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/subscribers" 
          element={
            <ProtectedRoute>
              <SubscribersPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/support" 
          element={
            <ProtectedRoute>
              <SupportDashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tickets" 
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tickets/:id" 
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
