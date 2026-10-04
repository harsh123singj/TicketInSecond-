import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const AdminEditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        eventDate: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        totalTickets: "",
        ticketPrice: ""
    });

    // -------------------------------
    // FETCH EVENT
    // -------------------------------
    useEffect(() => {
        if (authLoading) return;

        if (!user || user.role !== "ADMIN") {
            return;
        }

        fetchEvent();
    }, [authLoading, user, id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token required");
            }

            const response = await fetch(
                `${API_URL}/api/events/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch event"
                );
            }

            const fetchedEvent = data.event || data;

            setEvent(fetchedEvent);

            setFormData({
                name: fetchedEvent.name || "",
                type: fetchedEvent.type || "",
                eventDate: fetchedEvent.eventDate
                    ? new Date(fetchedEvent.eventDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
                eventTime: fetchedEvent.eventTime || "",
                venueName: fetchedEvent.venueName || "",
                venueAddress: fetchedEvent.venueAddress || "",
                totalTickets: fetchedEvent.totalTickets || "",
                ticketPrice: fetchedEvent.ticketPrice || ""
            });

        } catch (error) {
            console.error("Fetch event error:", error);
            setError(error.message || "Failed to fetch event");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // HANDLE INPUT
    // -------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // -------------------------------
    // UPDATE EVENT
    // -------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || user.role !== "ADMIN") {
            setError("Admin access required");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token required");
            }

            const response = await fetch(
                `${API_URL}/api/events/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        type: formData.type,
                        eventDate: formData.eventDate,
                        eventTime: formData.eventTime,
                        venueName: formData.venueName,
                        venueAddress: formData.venueAddress,
                        totalTickets: Number(formData.totalTickets),
                        ticketPrice: Number(formData.ticketPrice)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update event"
                );
            }

            navigate(`/admin/events/${id}`);

        } catch (error) {
            console.error("Update event error:", error);

            setError(
                error.message || "Failed to update event"
            );
        } finally {
            setSaving(false);
        }
    };

    // -------------------------------
    // AUTH LOADING
    // -------------------------------
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Checking admin access...
                    </p>
                </div>
            </div>
        );
    }

    // -------------------------------
    // NOT ADMIN
    // -------------------------------
    if (!user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 max-w-xl w-full text-center">
                    Admin access required
                </div>
            </div>
        );
    }

    // -------------------------------
    // PAGE LOADING
    // -------------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading event...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* HEADER */}
            <div className="bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">

                    <button
                        onClick={() =>
                            navigate(`/admin/events/${id}`)
                        }
                        className="text-gray-300 hover:text-white mb-8"
                    >
                        ← Back to Event
                    </button>

                    <p className="text-orange-500 tracking-[0.4em] text-sm font-semibold">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-4">
                        Edit Event
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Update the event details below.
                    </p>

                </div>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto px-6 py-12">

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* EVENT NAME */}
                    <div>
                        <label className="block text-[#09294f] font-semibold mb-2">
                            Event Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="block text-[#09294f] font-semibold mb-2">
                            Event Type
                        </label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select Type</option>
                            <option value="MOVIE">Movie</option>
                            <option value="CONCERT">Concert</option>
                            <option value="CRICKET">Cricket</option>
                            <option value="COMEDY">Comedy</option>
                        </select>
                    </div>

                    {/* DATE + TIME */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-[#09294f] font-semibold mb-2">
                                Event Date
                            </label>

                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[#09294f] font-semibold mb-2">
                                Event Time
                            </label>

                            <input
                                type="time"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                    </div>

                    {/* VENUE */}
                    <div>
                        <label className="block text-[#09294f] font-semibold mb-2">
                            Venue Name
                        </label>

                        <input
                            type="text"
                            name="venueName"
                            value={formData.venueName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label className="block text-[#09294f] font-semibold mb-2">
                            Venue Address
                        </label>

                        <input
                            type="text"
                            name="venueAddress"
                            value={formData.venueAddress}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* TICKETS + PRICE */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-[#09294f] font-semibold mb-2">
                                Total Tickets
                            </label>

                            <input
                                type="number"
                                name="totalTickets"
                                value={formData.totalTickets}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[#09294f] font-semibold mb-2">
                                Ticket Price
                            </label>

                            <input
                                type="number"
                                name="ticketPrice"
                                value={formData.ticketPrice}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/admin/events/${id}`)
                            }
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#ff5a00] hover:bg-[#e84f00] disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
                        >
                            {saving
                                ? "Updating..."
                                : "Update Event"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminEditEvent;