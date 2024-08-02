"use client";
import { useRouter } from "next/navigation";

export default function PlotPage({ params: { id } }) {
    const router = useRouter();
    return (
        <>
            <h1>PlotPage {id}</h1>
            <button
            onClick={() => {
                router.push('/') 
            }}
            >Powrót do strony głównej</button>
        </>
    )
}