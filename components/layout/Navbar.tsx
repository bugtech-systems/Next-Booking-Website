'use client'
import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";

const Navbar = () => {
    const router = useRouter();
    const { userId} = useAuth();

    return ( <div className="sticky top-0 border border-b-primary/10 bg-secondary z-50">
    <Container>
    <div className="flex justify-between">
    <div className="flex items-center gap-1 cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo.svg" alt="logo" width='50' height='30'/>
        {<div className="font-bold text-xl">BugKing</div>}
    </div>
    <SearchInput/>
    <div className="flex gap-3 items-center">
        <div>
        <ModeToggle/>
        <NavMenu/>
        </div>
        <UserButton afterSignOutUrl="/"/>
        {!userId && <>
            <Button variant="outline" size="sm" onClick={() => router.push('/sign-in')}>Sign in</Button>
            <Button size="sm" onClick={() => router.push('/sign-up')}>Sign up</Button>
        </>}
        </div>
        </div>
    </Container>
    </div> 
    );
}
 
export default Navbar;