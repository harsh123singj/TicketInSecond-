import prisma from "../config/prisma.js";


// ==========================================
// CREATE EVENT
// ==========================================

export const createEvent = async (req, res) => {
    try {
        const {
            name,
            type,
            eventDate,
            eventTime,
            venueName,
            venueAddress,
            totalTickets,
            ticketPrice
        } = req.body;

        // Basic validation
        if (
            !name ||
            !type ||
            !eventDate ||
            !eventTime ||
            !venueName ||
            !venueAddress ||
            totalTickets === undefined ||
            ticketPrice === undefined
        ) {
            return res.status(400).json({
                message: "All event fields are required"
            });
        }

        const tickets = Number(totalTickets);
        const price = Number(ticketPrice);

        if (!Number.isInteger(tickets) || tickets <= 0) {
            return res.status(400).json({
                message: "Total tickets must be a positive integer"
            });
        }

        if (price < 0 || Number.isNaN(price)) {
            return res.status(400).json({
                message: "Ticket price must be a valid number"
            });
        }

        // ==========================================
        // CREATE EVENT + SEATS IN ONE TRANSACTION
        // ==========================================

        const result = await prisma.$transaction(async (tx) => {

            // 1. Create event
            const event = await tx.event.create({
                data: {
                    name,
                    type,
                    eventDate: new Date(eventDate),
                    eventTime,
                    venueName,
                    venueAddress,
                    totalTickets: tickets,
                    ticketPrice: price
                }
            });

            // 2. Generate seats automatically
            const seats = [];

            for (let i = 1; i <= tickets; i++) {
                seats.push({
                    eventId: event.id,
                    seatNumber: `A${i}`,
                    status: "AVAILABLE"
                });
            }

            // 3. Insert all seats
            await tx.seat.createMany({
                data: seats
            });

            // 4. Return event
            return event;
        });

        return res.status(201).json({
            message: "Event and seats created successfully",
            event: result
        });

    } catch (error) {
        console.error("Create event error:", error);

        return res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL EVENTS
// ==========================================

export const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                eventDate: "asc"
            }
        });

        return res.status(200).json({
            events
        });

    } catch (error) {
        console.error("Get all events error:", error);

        return res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};


// ==========================================
// GET EVENT BY ID
// ==========================================

export const getEventById = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            include: {
                seats: true,
                bookings: true
            }
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        return res.status(200).json({
            event
        });

    } catch (error) {
        console.error("Get event by ID error:", error);

        return res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE EVENT
// ==========================================

export const updateEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const {
            name,
            type,
            eventDate,
            eventTime,
            venueName,
            venueAddress,
            totalTickets,
            ticketPrice
        } = req.body;

        // Check if event exists
        const existingEvent = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });

        if (!existingEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const event = await prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                ...(name !== undefined && {
                    name
                }),

                ...(type !== undefined && {
                    type
                }),

                ...(eventDate !== undefined && {
                    eventDate: new Date(eventDate)
                }),

                ...(eventTime !== undefined && {
                    eventTime
                }),

                ...(venueName !== undefined && {
                    venueName
                }),

                ...(venueAddress !== undefined && {
                    venueAddress
                }),

                ...(totalTickets !== undefined && {
                    totalTickets: Number(totalTickets)
                }),

                ...(ticketPrice !== undefined && {
                    ticketPrice: Number(ticketPrice)
                })
            }
        });

        return res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        console.error("Update event error:", error);

        return res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};


// ==========================================
// DELETE EVENT
// ==========================================

export const deleteEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        /*
         * Delete related records first.
         *
         * Event
         *   ├── Booking
         *   └── Seat
         *
         * Then delete the Event.
         */

        await prisma.$transaction(async (tx) => {

            // Delete bookings belonging to this event
            await tx.booking.deleteMany({
                where: {
                    eventId: eventId
                }
            });

            // Delete seats belonging to this event
            await tx.seat.deleteMany({
                where: {
                    eventId: eventId
                }
            });

            // Delete the event itself
            await tx.event.delete({
                where: {
                    id: eventId
                }
            });
        });

        return res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Delete event error:", error);

        return res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};