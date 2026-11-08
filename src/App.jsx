import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from "./Login";
import Home from "./Home";
import ResetPassword from './ResetPassword'

function App() {

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>


  );
}

export default App;