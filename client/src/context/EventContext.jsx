import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const EventContext = createContext();

const API_URL = `${import.meta.env.VITE_API_URL}/api/events`;

export const EventProvider = ({ children }) => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("Fetching events from:", API_URL);

            const response = await fetch(API_URL);

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                const text = await response.text();

                console.error("Non-JSON response:", text);

                throw new Error(
                    `Server returned ${response.status} instead of JSON`
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch events"
                );
            }

            setEvents(data.events || data);

        } catch (error) {

            console.error("Fetch events error:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <EventContext.Provider
            value={{
                events,
                loading,
                error,
                fetchEvents
            }}
        >
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    return useContext(EventContext);
};