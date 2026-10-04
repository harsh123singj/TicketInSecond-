import { useEffect, useState } from "react";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/EventCard";

import movieImage from "../assets/movie-bg.png";
import concertImage from "../assets/concert-bg.png";
import sportsImage from "../assets/cricket-bg.png";
import comedyImage from "../assets/comedy-bg.png";

const Home = () => {
    const { events, loading, error, fetchEvents } = useEvents();

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: movieImage,
            title: "Experience the magic of cinema.",
            subtitle:
                "Watch the latest movies on the big screen and enjoy unforgettable experiences.",
            category: "MOVIES",
        },
        {
            image: concertImage,
            title: "Feel the music. Live.",
            subtitle:
                "Discover unforgettable concerts and live performances from your favorite artists.",
            category: "CONCERTS",
        },
        {
            image: sportsImage,
            title: "Live the game.",
            subtitle:
                "Experience the energy of live sports and cheer for your favorite teams.",
            category: "SPORTS",
        },
        {
            image: comedyImage,
            title: "Laugh. Enjoy. Experience.",
            subtitle:
                "Discover amazing comedy shows and live performances near you.",
            category: "COMEDY",
        },
    ];

    // Fetch events when Home page loads
    useEffect(() => {
        fetchEvents();
    }, []);

    // Automatic carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev === slides.length - 1) {
                    return 0;
                }

                return prev + 1;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Next slide
    const nextSlide = () => {
        setCurrentSlide((prev) => {
            if (prev === slides.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    };

    // Previous slide
    const previousSlide = () => {
        setCurrentSlide((prev) => {
            if (prev === 0) {
                return slides.length - 1;
            }

            return prev - 1;
        });
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* =====================================================
                HERO CAROUSEL
            ====================================================== */}

            <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-black">

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            currentSlide === index
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >

                        {/* Background Image */}
                        <img
                            src={slide.image}
                            alt={slide.category}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/55" />

                        {/* Left Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                        {/* Hero Content */}
                        <div className="relative z-10 h-full flex items-center">

                            <div className="max-w-7xl w-full mx-auto px-6 md:px-10">

                                <div className="max-w-2xl">

                                    {/* Small Heading */}
                                    <p className="text-[#ff5a00] font-semibold tracking-[0.25em] text-sm md:text-base mb-4">
                                        TICKETS IN SECONDS
                                    </p>

                                    {/* Main Heading */}
                                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-5 max-w-xl leading-relaxed">
                                        {slide.subtitle}
                                    </p>

                                    {/* Button */}
                                    <button
                                        type="button"
                                        className="mt-8 bg-[#ff5a00] hover:bg-[#e84f00] text-white font-semibold px-7 py-3 rounded-lg transition duration-300"
                                    >
                                        Explore Events
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                ))}


                {/* =====================================================
                    PREVIOUS BUTTON
                ====================================================== */}

                <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                    className="
                        absolute
                        left-4 md:left-8
                        top-1/2
                        -translate-y-1/2
                        z-20
                        w-10 h-10
                        md:w-12 md:h-12
                        rounded-full
                        bg-black/50
                        hover:bg-black/80
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        transition
                    "
                >
                    ‹
                </button>


                {/* =====================================================
                    NEXT BUTTON
                ====================================================== */}

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="
                        absolute
                        right-4 md:right-8
                        top-1/2
                        -translate-y-1/2
                        z-20
                        w-10 h-10
                        md:w-12 md:h-12
                        rounded-full
                        bg-black/50
                        hover:bg-black/80
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        transition
                    "
                >
                    ›
                </button>


                {/* =====================================================
                    SLIDE INDICATORS
                ====================================================== */}

                <div
                    className="
                        absolute
                        bottom-8
                        left-1/2
                        -translate-x-1/2
                        z-20
                        flex
                        items-center
                        gap-3
                    "
                >
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`
                                h-2
                                rounded-full
                                transition-all
                                duration-300
                                ${
                                    currentSlide === index
                                        ? "w-8 bg-[#ff5a00]"
                                        : "w-2 bg-white/60 hover:bg-white"
                                }
                            `}
                        />
                    ))}
                </div>

            </section>


            {/* =====================================================
                UPCOMING EVENTS
            ====================================================== */}

            <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">

                {/* Section Heading */}
                <div className="mb-10">

                    <h2 className="text-3xl md:text-4xl font-bold text-[#09294f]">
                        Upcoming Events
                    </h2>

                    <p className="text-gray-500 mt-2 text-lg">
                        Find your next experience.
                    </p>

                </div>


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && (
                    <div className="flex justify-center items-center py-16">

                        <p className="text-gray-500 text-lg">
                            Loading events...
                        </p>

                    </div>
                )}


                {/* =================================================
                    ERROR
                ================================================== */}

                {!loading && error && (
                    <div className="text-center py-16">

                        <p className="text-red-500 text-lg">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchEvents}
                            className="
                                mt-5
                                bg-[#ff5a00]
                                hover:bg-[#e84f00]
                                text-white
                                font-semibold
                                px-6
                                py-2
                                rounded-lg
                                transition
                            "
                        >
                            Try Again
                        </button>

                    </div>
                )}


                {/* =================================================
                    EVENTS
                ================================================== */}

                {!loading && !error && events.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            gap-6
                        "
                    >

                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                            />
                        ))}

                    </div>
                )}


                {/* =================================================
                    NO EVENTS
                ================================================== */}

                {!loading &&
                    !error &&
                    events.length === 0 && (

                        <div className="text-center py-16">

                            <p className="text-gray-500 text-lg">
                                No events available.
                            </p>

                        </div>
                    )}

            </section>

        </div>
    );
};

export default Home;