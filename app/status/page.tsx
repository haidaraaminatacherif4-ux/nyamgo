import { db } from "@/lib/db";
export const dynamic="force-dynamic";
export default async function Page(){const count=await db.restaurant.count();return <main><h1>Nyamgo</h1><p>{count} restaurants</p></main>}
