import { Booking, Hotel, Room } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { AirVent, Bath, Bed, BedDouble, Castle, Home, Loader2, MountainSnow, Pencil, Plus, Ship, Trash, Trees, Tv, Users, UtensilsCrossed, VolumeX, Wand2, Wifi } from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps{
    hotel?: Hotel & {
        rooms: Room[]
    };
    room: Room;
    bookings?: Booking[];
}

const RoomCard = ({hotel, room, bookings = []}: RoomCardProps) => {
    const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId} = useBookRoom();
    const [isLoading, setIsLoading] = useState(false);
    const [bookingIsLoading, setBookingIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>()
    const [totalPrice, setTotalPrice] = useState(room.roomPrice)
    const [includeBreakFast, setIncludeBreakFast] = useState(false);
    const [days, setDays] = useState(1)
    const {userId } = useAuth();
    const pathname = usePathname();
    const isHotelDetailsPage = pathname.includes('hotel-details');
    
    const router = useRouter();
    const {toast} = useToast();


    const handleDialogueOpen = () => {
        setOpen(prev => !prev)
    }


    const handleDeleteRoom = (room: Room) => {
        setIsLoading(true)
    
        const imageKey = room.image.substring(room.image.lastIndexOf('/') + 1);
        
        axios.post('/api/uploadthing/delete', { imageKey }).then(() => {
         axios.delete(`/api/room/${room.id}`)
        .then(() => {
            router.refresh()
            toast({
                variant: 'success',
                description: 'Room Deleted!'
            })
            setIsLoading(false)
        })
        .catch((err) => {
            toast({
                variant: "destructive",
                description: "Something went wrong"
            })    
            setIsLoading(false)
        })
    }).catch((err) => {
        toast({
            variant: "destructive",
            description: "Something went wrong"
        })    
        setIsLoading(false)
    });
        
    }
    
    const handleBookRoom = () => {
        if(!userId) return toast({
            variant: "destructive",
            description: "Oops! Make sure you are logged in."
        })
        
        if(!hotel?.userId) return toast({
            variant: 'destructive',
            description: 'Something went wrong, refresh the page and try again!'
        })
        
        if(date?.from && date?.to){
            setBookingIsLoading(true)
            const bookingRoomData = {
                room,
                totalPrice,
                breakFastIncluded: includeBreakFast,
                startDate: date.from,
                endDate: date.to
            }
            
            setRoomData(bookingRoomData);
            
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    booking: {
                        hotelOwnerId: hotel.userId,
                        hotelId: hotel.id,
                        roomId: room.id,
                        startDate: date.from,
                        endDate: date.to,
                        breakFastIncluded: includeBreakFast,
                        totalPrice: totalPrice
                    },
                    payment_intent_id: paymentIntentId
                })
            }).then(async (res) => {
            console.log(res, 'RSSSS')
                setBookingIsLoading(false)
                if(res.status === 401){
                    return router.push('/login')
                }
                return res.json();
            })
            .then((data) => {
     
                setClientSecret(data.paymentIntent.client_secret)
                setPaymentIntentId(data.paymentIntent.id)
                router.push('/book-room')
            })
            .catch((error: any) => {
                console.log('Error', error)
                toast({
                    variant: 'destructive',
                    description: `Error! ${error.message}`
                })
            })
        
        } else {
            toast({
                variant: 'destructive',
                description: 'Oops!  Select Date'
            })
        
        }
        
    }
    
    
    const disabledDates = useMemo(() => {
                let dates: Date[] = [];
                const roomBookings = bookings.filter(booking => booking.roomId === room.id)
                roomBookings.forEach(booking =>{
                    const range = eachDayOfInterval({
                        start: new Date(booking.startDate),
                        end: new Date(booking.endDate)
                    })
                dates = [...dates, ...range]
            })
            return dates;
    }, [bookings])
    
    

    useEffect(() => {
        if(date && date.from && date.to){
            let dayCount = differenceInCalendarDays(
                date.to,
                date.from
            ) 
            dayCount = dayCount ? dayCount : 1 
            
            setDays(dayCount)
            
            if(room.roomPrice){
                if(includeBreakFast && room.breakFastPrice){
                setTotalPrice((dayCount * room.roomPrice) + (dayCount * room.breakFastPrice))
                } else {
                setTotalPrice(dayCount * room.roomPrice)
                }
            } else {
                setTotalPrice(room.roomPrice)
            }
        }
    }, [date, room.roomPrice, includeBreakFast])



    return ( 
        <Card className="flex flex-col">
        <div className="flex-grow">
        <CardHeader>
            <CardTitle>{room.title}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
        </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">

                <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
                    <Image fill src={room.image} alt={room.title} className="object-cover"/>
                </div>
                <Separator/>
                <div className="grid grid-cols-2 gap-4 content-start text-sm">
                    <AmenityItem><Bed className="h-4 w-4"/>{room.bedCount} Bed{'(s)'}</AmenityItem>
                    <AmenityItem><Users className="h-4 w-4"/>{room.guestCount} Guest{'(s)'}</AmenityItem>
                    <AmenityItem><Bath className="h-4 w-4"/>{room.bathroomCount} Bathroom{'(s)'}</AmenityItem>
                    {!!room.kingBed && <AmenityItem><BedDouble className="h-4 w-4"/>{room.kingBed} King Bed{'(s)'}</AmenityItem>}
                    {!!room.queenBed && <AmenityItem><Bed className="h-4 w-4"/>{room.queenBed} Queen Bed{'(s)'}</AmenityItem>}
                    {room.roomService && <AmenityItem><UtensilsCrossed className="h-4 w-4"/>Room Services</AmenityItem>}
                    {room.TV && <AmenityItem><Tv className="h-4 w-4"/>TV</AmenityItem>}
                    {room.balcony && <AmenityItem><Home className="h-4 w-4"/>Balcony</AmenityItem>}
                    {room.freeWifi && <AmenityItem><Wifi className="h-4 w-4"/>Free Wifi</AmenityItem>}
                    {room.cityView && <AmenityItem><Castle className="h-4 w-4"/>City View</AmenityItem>}
                    {room.oceanView && <AmenityItem><Ship className="h-4 w-4"/>Ocean View</AmenityItem>}
                    {room.forestView && <AmenityItem><Trees className="h-4 w-4"/>Forest View</AmenityItem>}
                    {room.mountainView && <AmenityItem><MountainSnow className="h-4 w-4"/>Mountain View</AmenityItem>}
                    {room.airCondition && <AmenityItem><AirVent className="h-4 w-4"/>Air Condition</AmenityItem>}
                    {room.soundProofed && <AmenityItem><VolumeX className="h-4 w-4"/>Sound Proofed</AmenityItem>}
                </div>
                <Separator/>
                <div className="flex gap-4 justify-between">
                    <div>Room Price: <span className="font-bold">₱{room.roomPrice}</span ><span className="text-xs">/24hrs</span>  </div>
                    {!!room.breakFastPrice && <div>BreakFast Price: <span className="font-bold">₱{room.breakFastPrice}</span></div>}
                </div>
            </CardContent>
            </div>
            <CardFooter className="flex-grow">
                {isHotelDetailsPage ? <div className="flex flex-col gap-6 w-full">
                    <div>
                        <div className="mb-2">Select days that you will spend in this room</div>
                        <DatePickerWithRange disabledDates={disabledDates} date={date} setDate={setDate}/>
                    </div>
                    {
                        room.breakFastPrice > 0 && <div>
                            <div className="mb-2">Do you want to be served breakfast each day</div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id={`breakFast-${room.id}`} onCheckedChange={(value) => setIncludeBreakFast(!!value)} disabled={!date} />
                                <label htmlFor={`breakFast-${room.id}`}>Include BreakFast</label>
                            </div>
                        </div>
                    }
                    <div>Total Price: <span className="font-bold">₱{totalPrice}</span> for <span className="font-bold">{days} Days</span></div>
                    <Button onClick={() => handleBookRoom()} disabled={bookingIsLoading} type="button" className="flex-1">
                        {bookingIsLoading ? <Loader2 className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4"/>}
                        {bookingIsLoading ? 'Loading...' : 'Book Room'}
                    </Button>
                </div> :  !pathname.includes('book-room') &&
 <div className="flex w-full justify-between">
                <Button disabled={isLoading} type="button" variant="ghost" onClick={() => handleDeleteRoom(room)}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4"/> Deleting...</> : <><Trash className="mr-2 h-4 w-4"/> Delete</>}
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button type="button" variant="outline" className="max-w-[150px]">
                            <Pencil className='mr-2 h-4 w-4'/> Update Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-[900px] w-[90%]'>
                      <DialogHeader className="px-2">
                        <DialogTitle>Update Room</DialogTitle>
                        <DialogDescription>
                            Make changes to this room.
                        </DialogDescription>
                      </DialogHeader>
                      <AddRoomForm hotel={hotel} room={room} handleDialogueOpen={handleDialogueOpen}/>
                    </DialogContent>
                  </Dialog>
                </div>
                
                }
            
            </CardFooter>
        </Card>
    );
}
 
export default RoomCard;