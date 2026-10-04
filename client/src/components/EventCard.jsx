import { useNavigate } from "react-router-dom";

import concertImage from "../assets/concert-bg.png";
import cricketImage from "../assets/cricket-bg.png";
import movieImage from "../assets/movie-bg.png";
import comedyImage from "../assets/comedy-bg.png";

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    const getEventImage = (type) => {
        const eventType = type?.toLowerCase();

        if (
            eventType?.includes("concert") ||
            eventType?.includes("music")
        ) {
            return concertImage;
        }

        if (
            eventType?.includes("cricket") ||
            eventType?.includes("sport")
        ) {
            return cricketImage;
        }

        if (
            eventType?.includes("movie") ||
            eventType?.includes("cinema") ||
            eventType?.includes("film")
        ) {
            return movieImage;
        }

        if (
            eventType?.includes("comedy") ||
            eventType?.includes("standup") ||
            eventType?.includes("stand-up")
        ) {
            return comedyImage;
        }

        return concertImage;
    };

    return (
        <div
            className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition
                duration-300
                flex
                flex-col
                h-full
            "
        >

            {/* ================= IMAGE ================= */}
            <div className="h-52 overflow-hidden shrink-0">
                <img
                    src={getEventImage(event.type)}
                    alt={event.name}
                    className="
                        w-full
                        h-full
                        object-cover
                        hover:scale-105
                        transition
                        duration-500
                    "
                />
            </div>


            {/* ================= CONTENT ================= */}
            <div className="p-6 flex flex-col flex-1">

                {/* Event Name */}
                <h3
                    className="
                        text-2xl
                        font-bold
                        text-[#09294f]
                        h-[64px]
                        line-clamp-2
                        overflow-hidden
                    "
                >
                    {event.name}
                </h3>


                {/* Event Type */}
                <p
                    className="
                        text-gray-500
                        mt-2
                        uppercase
                        text-sm
                        font-medium
                    "
                >
                    {event.type}
                </p>


                {/* Event Information */}
                <div
                    className="
                        mt-5
                        space-y-3
                        text-gray-600
                        text-base
                    "
                >

                    {/* Date */}
                    <p className="flex items-center gap-2">
                        <span>📅</span>

                        <span>
                            {new Date(
                                event.eventDate
                            ).toLocaleDateString("en-IN")}
                        </span>
                    </p>


                    {/* Time */}
                    <p className="flex items-center gap-2">
                        <span>🕐</span>

                        <span>
                            {event.eventTime}
                        </span>
                    </p>


                    {/* Venue */}
                    <p className="flex items-center gap-2">
                        <span>📍</span>

                        <span className="line-clamp-1">
                            {event.venueName}
                        </span>
                    </p>

                </div>


                {/* ================= BOTTOM ================= */}
                <div
                    className="
                        mt-auto
                        pt-6
                        flex
                        items-center
                        justify-between
                    "
                >

                    {/* Price */}
                    <span
                        className="
                            text-2xl
                            font-bold
                            text-[#ff5a00]
                        "
                    >
                        ₹{event.ticketPrice}
                    </span>


                    {/* View Event */}
                    <button
                        onClick={() =>
                            navigate(`/events/${event.id}`)
                        }
                        className="
                            bg-[#ff5a00]
                            hover:bg-[#e84f00]
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            transition
                            duration-200
                        "
                    >
                        View Event
                    </button>

                </div>

            </div>
        </div>
    );
};

export default EventCard;