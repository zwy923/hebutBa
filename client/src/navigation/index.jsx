import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React from "react";
import Error from "../components/error";
import Header from "../components/header";
import Input from "../components/input";
import Footer from "../components/footer"
/** 组件名称必须大写啊 */
const Navigation = () =>{
    return(
        <Router>
            <Header />
            <Routes>
                <Route path="*" element={<Error />} />
                <Route path="/" element={<Input />} />
            </Routes>
            <Footer />
        </Router>
    )
}

export default Navigation;