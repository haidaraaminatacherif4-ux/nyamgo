import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(request: NextRequest,{params}:{params:Promise<{id:string}>}){
 const user=await requireRole(["RESTAURANT","ADMIN"]);if(!user)return NextResponse.json({error:"Accès refusé."},{status:403});
 const {id}=await params;const order=await db.order.findUnique({where:{id}});if(!order)return NextResponse.json({error:"Commande introuvable."},{status:404});
 if(user.role=== "RESTAURANT"&&(!user.restaurant||order.restaurantId!==user.restaurant.id))return NextResponse.json({error:"Accès refusé."},{status:403});
 const parsed=z.object({status:z.enum(["PENDING","ACCEPTED","PREPARING","READY","COMPLETED","REJECTED"])}).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Statut invalide."},{status:400});
 const updated=await db.order.update({where:{id},data:{status:parsed.data.status}});return NextResponse.json({order:updated});
}
