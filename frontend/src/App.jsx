import React, { lazy, Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";

// Lazy-loaded pages
const Signup = lazy(() => import("./pages/signup"));
const Signin = lazy(() => import("./pages/signin"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Reels = lazy(() => import("./pages/Reels"));
const Profile = lazy(() => import("./pages/Profile"));
const Create = lazy(() => import("./pages/Create"));
const Saved = lazy(() => import("./pages/Saved"));
const Settings = lazy(() => import("./pages/Settings"));

// Import auth check thunk (adjust path/name to match your real file)
import { getCurrentUser } from "./redux/userSlice"; // ← most likely this one

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
    <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-zinc-400 text-sm">Loading...</p>
  </div>
);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use correct slice name – you have "user" in your store
  const { userData, isLoading = false, isAuthenticated = false } = useSelector(
    (state) => state.user || {}
  );

  // Check auth status once when app mounts
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Smart redirect after login (if user came from a protected page)
  useEffect(() => {
    if (isAuthenticated && location.state?.from) {
      navigate(location.state.from.pathname, { replace: true, state: {} });
    }
  }, [isAuthenticated, location.state, navigate]);

  // Show loader during initial auth check
  if (isLoading) {
    return <PageLoader />;
  }

  // ────────────────────────────────────────────────
  // Route Protection Components
  // ────────────────────────────────────────────────

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (isAuthenticated) {
      // Redirect to intended page or fallback to home
      const redirectTo = location.state?.from?.pathname || "/home";
      return <Navigate to={redirectTo} replace />;
    }
    return children;
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Root redirect – smart based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          {/* Auth / public pages */}
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <Signin />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />

          {/* Protected / authenticated pages */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <Reels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 – modern & friendly */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black flex items-center justify-center text-white px-6">
                <div className="text-center max-w-md">
                  <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    404
                  </h1>
                  <p className="text-2xl font-semibold mb-4">Page not found</p>
                  <p className="text-zinc-400 mb-10">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl font-bold text-lg hover:brightness-110 transition-all shadow-xl shadow-rose-900/40"
                    aria-label="Go back to previous page"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;