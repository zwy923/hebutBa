import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React from "react"
import Error from "../components/error"
import Header from "../components/header"
import Input from "../components/input"
import Footer from "../components/footer"
import Login from "../components/LoginForm"


const Navigation = () =>{
    return(
        <Router>
            <Header />
            <Routes>
                <Route path="*" element={<Error />} />
                <Route path="/" element={<Input />} />
                <Route path='/login' element={<Login />} />
            </Routes>
            <Footer title="*-*" description="code communication"/>
        </Router>
    )
}

export default Navigation;