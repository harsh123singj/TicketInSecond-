const Footer = () => {
    return (
        <footer className="bg-black text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold">
                            <span className="text-[#ff5a00]">TICKETS</span>INSECONDS
                        </h2>

                        <p className="text-gray-400 mt-4 leading-relaxed">
                            Book tickets for concerts, movies, sports and
                            other live events in seconds.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>

                        <div className="flex flex-col gap-3">
                            <a
                                href="/"
                                className="text-gray-400 hover:text-[#ff5a00] transition"
                            >
                                Home
                            </a>

                            <a
                                href="/my-bookings"
                                className="text-gray-400 hover:text-[#ff5a00] transition"
                            >
                                My Bookings
                            </a>

                            <a
                                href="/login"
                                className="text-gray-400 hover:text-[#ff5a00] transition"
                            >
                                Login
                            </a>

                            <a
                                href="/register"
                                className="text-gray-400 hover:text-[#ff5a00] transition"
                            >
                                Register
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Contact
                        </h3>

                        <div className="space-y-3 text-gray-400">
                            <p>support@ticketsinseconds.com</p>
                            <p>+91 99107 05140</p>
                            <p>New Delhi, India</p>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">

                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} TicketsInSeconds.
                        All rights reserved.
                    </p>

                    <p className="text-gray-500 text-sm">
                        Built for fast & reliable event booking.
                    </p>

                </div>

            </div>
        </footer>
    );
};

export default Footer;