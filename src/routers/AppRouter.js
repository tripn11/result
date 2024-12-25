import React from "react";
import { useSelector } from "react-redux";
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
import Classes from "../components/admin/classes/Classes";
import Section from "../components/admin/classes/Section";

export default () => {
    const classes = useSelector(state=>state.school.classes)
    return (
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
                        <Route path="classes" element={<Classes />}>
                            <Route index element={<Section section={classes.nursery} name='nursery' />} />
                            <Route path="primary" element={<Section section={classes.primary} name='primary' />} />
                            <Route path="jss" element={<Section section={classes.juniorSecondary} name='juniorSecondary'/>} />
                            <Route path="ss" element={<Section section={classes.seniorSecondary} name='seniorSecondary' />} />
                        </Route>
                        {/* <Route path="students" element={<Students />} />
                        <Route path="results" element={<Results />} /> */}
                    </Route>
                </Route>
                <Route path='/*' element={ <NotFoundPage /> } />
            </Routes>
        </BrowserRouter>
    )   
}
    
    