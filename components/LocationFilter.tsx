'use client'


import qs from 'query-string';
import { useEffect, useState } from "react";
import Container from "./Container";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue  } from "./ui/select";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from './ui/button';




const LocationFilter = () => {
        const [country, setCountry] = useState('');
        const [state, setState] = useState('');
        const [city, setCity] = useState('');
        const [states, setStates] = useState<IState[]>([]);
        const [cities, setCities] = useState<ICity[]>([]);
        const {getCountryByCode, getCountryStates, getStateCities, getAllCountries} = useLocation();
        const router = useRouter()
        const params = useSearchParams()
        const countries = getAllCountries;
        
        const handleClearFilter = () => {
            setCountry('')
            setState('')
            setCity('')
        }
        
        
        useEffect(() => {
            const countryStates = getCountryStates(country);
            if(countryStates){
                setStates(countryStates);
                setState('')
                setCity('')
            }
            
        }, [country])
        
        useEffect(() => {
            const stateCities = getStateCities(country, state);
            if(stateCities){
                setCities(stateCities)
                setCity('')
            }
            
        }, [country, state])
        
        useEffect(() => {
            if(country === '' && state === '' && city === '') return router.push('/')
            let currentQuery: any = {}
            
            if(params){
                currentQuery = qs.parse(params.toString())
            }
            
            if(country){
                currentQuery = {
                    ...currentQuery,
                    country
                }
            }
            
            if(state){
                currentQuery = {
                    ...currentQuery,
                    state
                }
            }
            
            if(city){
                currentQuery = {
                    ...currentQuery,
                    city
                }
            }
            
            if(state === '' && currentQuery.state) {
                delete currentQuery.state
            }
                        
            if(city === '' && currentQuery.city) {
                delete currentQuery.city
            }
                        
            const url = qs.stringifyUrl({
                url: '/',
                query: currentQuery
            }, { skipNull: true, skipEmptyString: true})
                        
            router.push(url)
        }, [country, state, city])
        
        
        return (<Container>
            <div className="flex gap-2 md:gap-4 items-center justify-center text-sm"> 
            <div>
                <Select
                    onValueChange={(value) => setCountry(value)}
                    value={country}
                >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Country"/>
                </SelectTrigger>
                <SelectContent> 
                    {countries.map((country: any) => {
                        return <SelectItem key={country.isoCode} value={country.isoCode}>
                            {country.name}
                        </SelectItem>
                    })}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    onValueChange={(value) => setState(value)}
                    value={state}
                >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="State"/>
                </SelectTrigger>
                <SelectContent> 
                    {!!states.length && states.map((state: any) => {
                        return <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                        </SelectItem>
                    })}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    onValueChange={(value) => setCity(value)}
                    value={city}
                >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="City"/>
                </SelectTrigger>
                <SelectContent> 
                    {!!cities.length && cities.map((city: any) => {
                        return <SelectItem key={city.name} value={city.name}>
                            {city.name}
                        </SelectItem>
                    })}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Button className="bg-background" onClick={() => handleClearFilter()} variant="outline">Clear Filters</Button>
            </div>
            </div> 
        
        </Container>)



}

export default LocationFilter;