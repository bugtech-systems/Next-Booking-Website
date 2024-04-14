'use client'

import Image from "next/image";
import { HotelWithRooms } from "./AddHotelForm";
import { Booking } from "@prisma/client";
import AmenityItem from "../AmenityItem";
import { Car, Dumbbell, MapPin, ShoppingBasket, Utensils, Waves, Wine } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import {  FaSpa, FaSwimmer } from 'react-icons/fa';
import {MdDryCleaning} from 'react-icons/md'
import RoomCard from "../room/RoomCard";



const HotelDetailsClient = ({hotel, bookings}: {hotel:  HotelWithRooms, bookings?: Booking[]}) => {
    const {getCountryByCode, getStateByCode} = useLocation();
    const country = getCountryByCode(hotel.country);
    const state = getStateByCode(hotel.country, hotel.state);
    
    
    return ( <div className="flex flex-col gap-6 pb-2">
        <div className="aspect-square overflow-hidden relative w-full-h-[200px] md:h-[400px] rounded-lg">
            <Image
                fill
                src={hotel.image}
                alt={hotel.title}
                className="object-cover"
            />
        </div>
        <div>
            <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
            <div className="font-semibold mt-4">
                <AmenityItem><MapPin className="h-4 w-4"/>{country?.name},{state?.name},{hotel.city}</AmenityItem>
            </div>
            <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
            <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
            <p className="text-primary/90 mb-2">{hotel.description}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
                {hotel.swimmingPool && <AmenityItem><FaSwimmer size={18}/> Pool</AmenityItem>}
                {hotel.gym && <AmenityItem><Dumbbell className="h-4 w-4"/> Gym</AmenityItem>}
                {hotel.spa && <AmenityItem><FaSpa size={18}/> Spa</AmenityItem>}
                {hotel.bar && <AmenityItem><Wine className="h-4 w-4"/> Bar</AmenityItem>}
                {hotel.laundry && <AmenityItem><MdDryCleaning size={18}/> Laundry Facilities</AmenityItem>}
                {hotel.restaurant && <AmenityItem><Utensils className="h-4 w-4"/> Restaurant</AmenityItem>}
                {hotel.shopping && <AmenityItem><ShoppingBasket className="h-4 w-4"/> Shopping</AmenityItem>}
                {hotel.freeParking && <AmenityItem><Car className="h-4 w-4"/> Free Parking</AmenityItem>}
                {hotel.movieNights && <AmenityItem><ShoppingBasket className="h-4 w-4"/> Movie Nights</AmenityItem>}
                {hotel.coffeeShop && <AmenityItem><Wine className="h-4 w-4"/> Coffee Shop</AmenityItem>}
            </div>
        </div>
        <div>
            {!!hotel.rooms.length && <div>
                <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {hotel.rooms.map(room => {
                        return <RoomCard hotel={hotel} room={room} key={room.id} bookings={bookings}/>
                    })}
                </div>
            </div>}
        </div>
    </div> );
}
 
export default HotelDetailsClient;