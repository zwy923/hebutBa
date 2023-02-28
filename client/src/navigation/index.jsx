import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React from "react";
import Error from "../components/error";
import Header from "../components/header";
import Input from "../components/input";
import BookDetail from "../components/BookDetail";
/** 组件名称必须大写啊 */
const Navigation = () =>{
    return(
        <Router>
            <Header />
            <Routes>
                <Route path="/book/:bookName" element={<BookDetail />} />
                <Route path="*" element={<Error />} />
                <Route path="/" element={<Input />} />
            </Routes>
        </Router>
    )
}

export default Navigation;