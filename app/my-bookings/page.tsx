import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import { getBookingByUserId } from "@/actions/getBookingByUserId";
import MyBookingClient from "@/components/booking/MyBookingsClient";

const MyBookings = async () => {
    const bookingsFromVisitors = await getBookingsByHotelOwnerId();
    const bookingsIHaveMade = await getBookingByUserId(); 
    console.log(bookingsIHaveMade, 'awdawd')
    if(!bookingsFromVisitors || !bookingsIHaveMade) return <div>No Bookings Found</div>
     
    return ( <div className="flex flex-col gap-10">
        {!!bookingsIHaveMade?.length &&  <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">Here are bookings you have made</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map(booking => {return <MyBookingClient key={booking.id} booking={booking} myBookings={true} />})}
            </div>
        </div>}
        {!!bookingsFromVisitors?.length &&  <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">Here are bookings visitors have made on your properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map(booking => {return <MyBookingClient key={booking.id} booking={booking} myBookings={false} />})}
            </div>
        </div>}
    </div> );
}
 
export default MyBookings;