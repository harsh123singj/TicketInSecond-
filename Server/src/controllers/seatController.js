import prisma from "../config/prisma.js";


export const createSeat = async (req , res)=>{
    try{
        const eventId = parseInt(req.params.eventId);

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const seats= [];

        for(let i=1 ;i<= event.totalTickets ;i++){
            seats.push({
                eventId: eventId,
                seatNumber: `A${i}`,
                status:"AVAILABLE"
            })
        }


        const createdSeat = await prisma.seat.createMany({
            data: seats,
            skipDuplicates: true
        });

        res.status(201).json({
            message: "Seats created successfully",
            createdSeat
        });
    }
    catch(error){
        console.error("Error creating seat:", error);
        res.status(500).json({ error: "Failed to create seat" });
    }
}



export const getSeatsByEvent = async(req , res)=>{
    try{
        const eventId = parseInt(req.params.eventId);

        const event = await prisma.event.findUnique({
            where:({
                id : eventId
            })
        })

        if(!event){
            return res.status(404).json({
                message: "Event not found"
            })
        }

        const seats = await prisma.seat.findMany({
            where:{
                eventId : eventId
            },
            orderBy:{
                id: 'asc'
            }
        });

        res.status(200).json({
            message: "Seats fetched successfully",
            seats
        })
           
    }
    catch(error){
                console.error("Error fetching seats:", error);

        res.status(500).json({
            message: "Failed to fetch seats",
            error: error.message
        });
    }
}

export const getEventSeats = async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);

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

        const seats = await prisma.seat.findMany({
            where: {
                eventId: eventId
            },
            orderBy: {
                id: "asc"
            }
        });

        res.status(200).json({
            message: "Seats fetched successfully",
            totalSeats: seats.length,
            seats
        });

    } catch (error) {
        console.error("Error fetching seats:", error);

        res.status(500).json({
            message: "Failed to fetch seats",
            error: error.message
        });
    }
};