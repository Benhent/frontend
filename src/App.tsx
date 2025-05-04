import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

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


import ProfilePage from "./pages/root/_rootpages/ProfilePage";

const App: React.FC = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <main
      className='min-h-screen flex items-center justify-center relative overflow-hidden 
      bg-gradient-to-br from-secondary via-third to-fourth'
    >

      <Routes>
        {/* public routes */}
        <Route element={<ProtectedRoute/>}>
          <Route path='/' element={<ProfilePage />}/>
        </Route>


        {/* private routes */}
        <Route element={<RedirectAuthenticatedUser/>}>
          <Route path='/signup' element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/forgot-password' element={<ForgotPasswordPage />}/>
          <Route path='/reset-password/:token' element={<ResetPasswordPage />}/>
        </Route>
        
        {/* email verify */}
        <Route path='/verify-email' element={<VerifyEmailPage />} />

        {/* catch all routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;