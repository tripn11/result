import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import WelcomePage from "../components/login/WelcomePage";
import NotFoundPage from "../components/NotFoundPage";
import LoginPage from "../components/login/LoginPage";
import AdminLoginPage from "../components/login/AdminLoginPage";
import SignupPage from "../components/login/SignupPage";
import Header from "../components/admin/Header";
import Basics from "../components/admin/Basics";

export default () => (
    <BrowserRouter>
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<WelcomePage />}/>
                <Route path='login' element={<AdminLoginPage />} />
                <Route path="login/:role" element={<LoginPage />}/>
                <Route path="signup" element={<SignupPage />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path="admin" element={<Header />}>
                    <Route index element={<Basics />} />
                    {/* <Route path="classes" element={<Classes />} />
                    <Route path="students" element={<Students />} />
                    <Route path="results" element={<Results />} /> */}
                </Route>
            </Route>
            <Route path='/*' element={ <NotFoundPage /> } />
        </Routes>
    </BrowserRouter>
)
