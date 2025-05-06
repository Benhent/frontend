import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import {ProtectedRoute} from "./pages/root/rootLayout";
import {RedirectAuthenticatedUser} from "./pages/auth/authLayout";
import LoadingSpinner from "./components/LoadingSpinner";

import RegisterPage from "./pages/auth/_authpages/RegisterPage";
import LoginPage from "./pages/auth/_authpages/LoginPage";
import ForgotPasswordPage from "./pages/auth/_authpages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/_authpages/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/_authpages/VerifyEmailPage";


import Dashboard from "./pages/root/_rootpages/Dashboard";
import Guide from "./pages/root/_rootpages/Guide";
import Contact from "./pages/root/_rootpages/Contact";

import ProfilePage from "./pages/root/_rootpages/ProfilePage";
import Security from "./pages/root/_rootpages/Security";
import PostArticle from "./pages/root/_rootpages/Postarticle";


import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
// import TestPage from "./pages/root/_rootpages/test";

const App: React.FC = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <LoadingSpinner />;

  // Danh sách các private routes
  const privateRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col">
      {!isPrivateRoute && <NavBar />}
      <main className={`flex-1 flex items-center justify-center ${!isPrivateRoute ? 'pt-16' : ''}`}>
        <Routes>

          {/* <Route path='/test' element={<TestPage />} /> */}
          {/* public routes */}
          {/* <Route element={<ProtectedRoute/>}> */}
            <Route path='/' element={<Dashboard />}/>
            <Route path='/guide' element={<Guide />}/>
            <Route path='/contact' element={<Contact />}/>
            
            <Route path='/security' element={<Security />}/>
            <Route path='/profile' element={<ProfilePage />}/>
            {/* <Route path='/post-article' element={<PostArticle />}/> */}
          {/* </Route> */}

          {/* private routes */}
          {/* <Route element={<RedirectAuthenticatedUser/>}> */}
            <Route path='/signup' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/forgot-password' element={<ForgotPasswordPage />}/>
            <Route path='/reset-password/:token' element={<ResetPasswordPage />}/>
          {/* </Route> */}
          
          {/* email verify */}
          <Route path='/verify-email' element={<VerifyEmailPage />} />

          {/* catch all routes */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
      {!isPrivateRoute && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;