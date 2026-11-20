import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(request:NextRequest){const user=await requireRole(["RESTAURANT"]);if(!user?.restaurant)return NextResponse.json({error:"Accès refusé."},{status:403});const body=await request.json();if(typeof body.isOpen!=="boolean")return NextResponse.json({error:"Statut invalide."},{status:400});const restaurant=await db.restaurant.update({where:{id:user.restaurant.id},data:{isOpen:body.isOpen}});return NextResponse.json({restaurant});}
