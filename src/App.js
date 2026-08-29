import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Service from "./pages/Service/Service";
import VendorProfile from "./pages/VendorProfile/VendorProfile";
import NearbyStall from "./pages/NearbyStall/NearbyStall";
import BecomeVendor from "./pages/BecomeVendor/BecomeVendor";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Vendors from "./components/Vendors/Vendors";
import ProviderProfile from "./components/ProviderProfile/ProviderProfile";
import CategoryListing from "./pages/CategoryListing/CategoryListing";
import ScrollToTop from "./components/ScrollToTop";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";


function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service/:slug/:vendorId" element={<VendorProfile />} />
          <Route path="/become-vendor" element={<BecomeVendor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} />
          <Route path="/category/:type/:categoryId" element={<CategoryListing />} />
          <Route path="/vendor/:type/:categoryId/:vendorId" element={<VendorProfile />} />
          <Route path="/act" element={<Service />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/nearby-stall" element={<NearbyStall />} />
          <Route path="/provider/:type/:id" element={<ProviderProfile />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
