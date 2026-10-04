import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
function AdminEventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            setError("");

            if (!token) {
                navigate("/login");
                return;
            }

            // Fetch event
            const eventResponse = await fetch(
                `${API_URL}/api/events/${id}`
            );

            if (!eventResponse.ok) {
                throw new Error("Failed to fetch event");
            }

            const eventData = await eventResponse.json();

            setEvent(eventData.event || eventData);

            // Fetch all bookings
            const bookingResponse = await fetch(
                `${API_URL}/api/booking/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!bookingResponse.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const bookingData = await bookingResponse.json();

            const allBookings =
                bookingData.bookings ||
                bookingData.data ||
                [];

            // Only bookings for this event
            const eventBookings = allBookings.filter(
                (booking) =>
                    String(booking.eventId) === String(id) ||
                    String(booking.event?.id) === String(id)
            );

            setBookings(eventBookings);

        } catch (error) {
            console.error(
                "Admin event details error:",
                error
            );

            setError(
                error.message ||
                "Failed to load event details"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE EVENT
    // =========================

    const handleDeleteEvent = async () => {
        try {
            setDeleting(true);
            setError("");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/events/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete event"
                );
            }

            setShowDeleteModal(false);
            setDeleteSuccess(true);

        } catch (error) {
            console.error(
                "Delete event error:",
                error
            );

            setShowDeleteModal(false);

            setError(
                error.message ||
                "Failed to delete event"
            );
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const confirmedBookings = bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED"
    );

    const cancelledBookings = bookings.filter(
        (booking) =>
            booking.status === "CANCELLED"
    );

    const totalRevenue =
        confirmedBookings.reduce(
            (total, booking) => {
                const price =
                    booking.event?.ticketPrice ||
                    event?.ticketPrice ||
                    0;

                return total + Number(price);
            },
            0
        );

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <div className="text-xl font-medium">
                    Loading event details...
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="min-h-screen bg-[#f7f5ef]">

                <div className="bg-black text-white px-6 py-8">
                    <div className="max-w-7xl mx-auto">

                        <button
                            onClick={() =>
                                navigate("/admin")
                            }
                            className="text-gray-300 hover:text-white mb-6"
                        >
                            ← Back to Admin
                        </button>

                        <p className="text-orange-500 tracking-[0.3em] text-sm">
                            ADMIN PANEL
                        </p>

                        <h1 className="text-4xl font-bold mt-3">
                            Event Details
                        </h1>

                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10">

                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6">
                        {error}
                    </div>

                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Event not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* =========================
                HEADER
            ========================= */}

            <div className="bg-black text-white">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    <button
                        onClick={() =>
                            navigate("/admin")
                        }
                        className="text-gray-300 hover:text-white mb-8"
                    >
                        ← Back to Admin
                    </button>

                    <p className="text-orange-500 tracking-[0.3em] text-sm">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-3">
                        Event Details
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage event information and bookings.
                    </p>

                </div>

            </div>

            {/* =========================
                MAIN
            ========================= */}

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* EVENT CARD */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                        <div>

                            <p className="text-orange-500 font-semibold tracking-wider">
                                {event.type || "EVENT"}
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {event.name}
                            </h2>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={() =>
                                    navigate(
                                        `/admin/events/${id}/edit`
                                    )
                                }
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Edit Event
                            </button>

                            <button
                                onClick={() =>
                                    setShowDeleteModal(true)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Delete Event
                            </button>

                        </div>

                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Event Date
                                </p>

                                <p className="font-semibold text-lg mt-1">
                                    {formatDate(
                                        event.eventDate
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Event Time
                                </p>

                                <p className="font-semibold text-lg mt-1">
                                    {event.eventTime ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Venue
                                </p>

                                <p className="font-semibold text-lg mt-1">
                                    {event.venueName ||
                                        "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Ticket Price
                                </p>

                                <p className="font-semibold text-lg mt-1">
                                    ₹
                                    {event.ticketPrice ||
                                        0}
                                </p>
                            </div>

                        </div>

                        {event.venueAddress && (
                            <div className="mt-6">

                                <p className="text-gray-500 text-sm">
                                    Venue Address
                                </p>

                                <p className="font-medium mt-1">
                                    {event.venueAddress}
                                </p>

                            </div>
                        )}

                    </div>

                </div>

                {/* =========================
                    STATISTICS
                ========================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

                    <div className="bg-white rounded-2xl p-6 shadow-sm border">

                        <p className="text-gray-500">
                            Total Capacity
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {event.totalTickets ||
                                0}
                        </p>

                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border">

                        <p className="text-gray-500">
                            Confirmed Bookings
                        </p>

                        <p className="text-3xl font-bold mt-2 text-green-600">
                            {confirmedBookings.length}
                        </p>

                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border">

                        <p className="text-gray-500">
                            Cancelled
                        </p>

                        <p className="text-3xl font-bold mt-2 text-red-500">
                            {cancelledBookings.length}
                        </p>

                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border">

                        <p className="text-gray-500">
                            Revenue
                        </p>

                        <p className="text-3xl font-bold mt-2 text-orange-500">
                            ₹
                            {totalRevenue.toLocaleString(
                                "en-IN"
                            )}
                        </p>

                    </div>

                </div>

                {/* =========================
                    BOOKINGS
                ========================= */}

                <div className="bg-white rounded-2xl shadow-sm border mt-8 overflow-hidden">

                    <div className="p-6 md:p-8 border-b">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Bookings
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    All bookings for this event.
                                </p>

                            </div>

                            <div className="text-gray-500">
                                {bookings.length} bookings
                            </div>

                        </div>

                    </div>

                    {bookings.length === 0 ? (

                        <div className="p-10 text-center">

                            <p className="text-xl font-semibold">
                                No bookings yet
                            </p>

                            <p className="text-gray-500 mt-2">
                                Bookings for this event
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Booking
                                        </th>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Seat
                                        </th>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Payment
                                        </th>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-sm text-gray-500">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {bookings.map(
                                        (booking) => (

                                            <tr
                                                key={
                                                    booking.id
                                                }
                                                className="border-b last:border-b-0 hover:bg-gray-50"
                                            >

                                                <td className="px-6 py-5 font-semibold">
                                                    #
                                                    {
                                                        booking.id
                                                    }
                                                </td>

                                                <td className="px-6 py-5">

                                                    <p className="font-medium">
                                                        {booking
                                                            .user
                                                            ?.name ||
                                                            booking
                                                                .user
                                                                ?.email ||
                                                            "Customer"}
                                                    </p>

                                                    {booking
                                                        .user
                                                        ?.email && (
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    booking
                                                                        .user
                                                                        .email
                                                                }
                                                            </p>
                                                        )}

                                                </td>

                                                <td className="px-6 py-5">

                                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md font-semibold">
                                                        {booking.seatNumber ||
                                                            "N/A"}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5">
                                                    {booking.paymentMethod ||
                                                        "N/A"}
                                                </td>

                                                <td className="px-6 py-5">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status ||
                                                            "UNKNOWN"}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5 text-gray-600">
                                                    {formatDate(
                                                        booking.createdAt
                                                    )}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* =========================
                DELETE CONFIRMATION MODAL
            ========================= */}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">

                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">

                        <div className="flex justify-center">

                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                                🗑️
                            </div>

                        </div>

                        <h2 className="text-2xl font-bold text-center mt-5">
                            Delete Event?
                        </h2>

                        <p className="text-gray-500 text-center mt-3">
                            Are you sure you want to delete
                            <span className="font-semibold text-gray-800">
                                {" "}
                                {event.name}
                            </span>
                            ?
                        </p>

                        <p className="text-red-500 text-sm text-center mt-3">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-7">

                            <button
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={deleting}
                                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleDeleteEvent
                                }
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* =========================
                DELETE SUCCESS POPUP
            ========================= */}

            {deleteSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">

                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">

                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-3xl">
                            ✓
                        </div>

                        <h2 className="text-2xl font-bold mt-5">
                            Event Deleted!
                        </h2>

                        <p className="text-gray-500 mt-2">
                            The event has been successfully
                            deleted.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin")
                            }
                            className="mt-7 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminEventDetails;