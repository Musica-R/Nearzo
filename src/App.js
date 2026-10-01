import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Service from "./pages/Service/Service";
import VendorProfile from "./pages/VendorProfile/VendorProfile";
import NearbyStall from "./pages/NearbyStall/NearbyStall";
import BecomeVendor from "./pages/BecomeVendor/BecomeVendor";
import ProfileRouter from "./pages/Profile/ProfileRouter";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Vendors from "./components/Vendors/Vendors";
import ProviderProfile from "./components/ProviderProfile/ProviderProfile";
import CategoryListing from "./pages/CategoryListing/CategoryListing";
import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/Requireauth";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import BusinessPortfolio from "./pages/BusinessPortfolio/BusinessPortfolio";
import JobListing from "./pages/JobListing/JobListing";
import JobDetail from "./pages/JobListing/JobDetail";
import VerifyOtp from "./pages/Verifyotp/Verifyotp";

function App() {
  // NOTE: the old `localStorage.removeItem("lokal_location")` line is removed.
  // It ran on every render and wiped the saved location.

  // localStorage.removeItem("thozhaa_role_choice");

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service/:slug/:vendorId" element={<VendorProfile />} />

          {/* Only for logged-in users. Guests are sent to /login first. */}
          <Route
            path="/become-vendor"
            element={
              <RequireAuth>
                <BecomeVendor />
              </RequireAuth>
            }
          />

          <Route path="/profile" element={<ProfileRouter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
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
          <Route path="/business-portfolio" element={<BusinessPortfolio />} />
          <Route path="/careers" element={<JobListing />} />
          <Route path="/careers/:id" element={<JobDetail />} />

          {/* keep the catch-all LAST */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;