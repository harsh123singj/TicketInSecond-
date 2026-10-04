import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminCreateEvent = () => {
    const navigate = useNavigate();

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/events`,
                {
                    method: "POST",
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
                    data.message || "Failed to create event"
                );
            }

            setSuccess("Event created successfully!");

            setFormData({
                name: "",
                type: "",
                eventDate: "",
                eventTime: "",
                venueName: "",
                venueAddress: "",
                totalTickets: "",
                ticketPrice: ""
            });

            setTimeout(() => {
                navigate("/admin");
            }, 1000);

        } catch (error) {
            console.error("Create event error:", error);
            setError(error.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-6 py-12">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <button
                        onClick={() => navigate("/admin")}
                        className="text-gray-500 hover:text-black transition mb-5"
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        Create Event
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Add a new event to TicketsInSeconds.
                    </p>

                </div>


                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">

                    {/* Error */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Event Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter event name"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>


                        {/* Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Type
                            </label>

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="">
                                    Select event type
                                </option>

                                <option value="Concert">
                                    Concert
                                </option>

                                <option value="Movie">
                                    Movie
                                </option>

                                <option value="Cricket">
                                    Cricket
                                </option>

                                <option value="Comedy">
                                    Comedy
                                </option>
                            </select>
                        </div>


                        {/* Date + Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event Date
                                </label>

                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event Time
                                </label>

                                <input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                        </div>


                        {/* Venue Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Venue Name
                            </label>

                            <input
                                type="text"
                                name="venueName"
                                value={formData.venueName}
                                onChange={handleChange}
                                placeholder="Enter venue name"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>


                        {/* Venue Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Venue Address
                            </label>

                            <textarea
                                name="venueAddress"
                                value={formData.venueAddress}
                                onChange={handleChange}
                                placeholder="Enter complete venue address"
                                rows="3"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>


                        {/* Tickets + Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Total Tickets
                                </label>

                                <input
                                    type="number"
                                    name="totalTickets"
                                    value={formData.totalTickets}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    min="1"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ticket Price
                                </label>

                                <input
                                    type="number"
                                    name="ticketPrice"
                                    value={formData.ticketPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 999"
                                    min="0"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                        </div>


                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">

                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ff5a00] hover:bg-[#e65100] text-white px-7 py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Event"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default AdminCreateEvent;