import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: {params: { Id: string }}){

    try{
        const { userId } = auth();
        
        if(!params.Id) {
            return new NextResponse("Payment Intent id is required", { status: 400 })
        }
        
        
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        
        
        console.log('INTEENENEN', params)
        const booking = await prismadb.booking.update({
            where: {
                paymentIntentId: params.Id
            },
            data: {
                paymentStatus: true
            }
        })
        
        
        return NextResponse.json(booking)
    } catch(error){
        console.log('ERROR at /api/booking/id PATCH', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {params: { Id: string }}){

    try{
        const { userId } = auth();
        
        if(!params.Id) {
            return new NextResponse("Booking id is required", { status: 400 })
        }
        
        
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        
        const booking = await prismadb.booking.delete({
            where: {
                id: params.Id
            }
        })
        
        
        return NextResponse.json(booking)
    } catch(error){
        console.log('ERROR at /api/booking/Id Delete', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function GET(req: Request, { params }: {params: { Id: string }}){

    try{
        const { userId } = auth();
        
        if(!params.Id) {
            return new NextResponse("Booking id is required", { status: 400 })
        }
        
        
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1)
        
        const booking = await prismadb.booking.findMany({
            where: {
                paymentStatus: true,
                roomId: params.Id,
                endDate: {
                    gt: yesterday
                }
            }
        })
        
        
        return NextResponse.json(booking)
    } catch(error){
        console.log('ERROR at /api/booking/Id Delete', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}