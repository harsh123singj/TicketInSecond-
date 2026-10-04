import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBooking";
import Navbar from "./components/Navbar";
import BookingDetails from "./pages/BookingDetails";
import Footer from "./components/Footer";

import AdminSettings from "./pages/admin/AdminSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import AdminEventDetails from "./pages/AdminEventDetails";
import AdminEditEvent from "./pages/AdminEditEvent";
import AdminBookings from "./pages/admin/AdminBookings";

import Settings from "./pages/Settings";

import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";


function App() {

    const location = useLocation();

    // Hide normal website navbar/footer on admin pages
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            {/* Scroll to top whenever route changes */}
            <ScrollToTop />

            {/* Normal website navbar */}
            {!isAdminPage && <Navbar />}

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= EVENTS ================= */}

                <Route
                    path="/events/:id"
                    element={<EventDetails />}
                />

                <Route
                    path="/events/:id/seats"
                    element={<SeatSelection />}
                />


                {/* ================= BOOKING ================= */}

                <Route
                    path="/events/:id/booking"
                    element={<Booking />}
                />

                <Route
                    path="/events/:id/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/my-bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="/bookings/:id"
                    element={<BookingDetails />}
                />


                {/* ================= SETTINGS ================= */}

                <Route
                    path="/settings"
                    element={<Settings />}
                />


                {/* ================= AUTH ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= ADMIN ================= */}

                <Route element={<AdminRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/events/create"
                        element={<AdminCreateEvent />}
                    />

                    <Route
                        path="/admin/events/:id"
                        element={<AdminEventDetails />}
                    />

                    <Route
                        path="/admin/events/:id/edit"
                        element={<AdminEditEvent />}
                    />

                    <Route
                        path="/admin/bookings"
                        element={<AdminBookings />}
                    />

                    <Route
                        path="/admin/settings"
                        element={<AdminSettings />}
                    />

                </Route>

            </Routes>

            {/* Normal website footer */}
            {!isAdminPage && <Footer />}
        </>
    );
}

export default App;