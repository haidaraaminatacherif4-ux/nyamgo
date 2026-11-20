import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){const user=await requireRole(["ADMIN"]);if(!user)return NextResponse.json({error:"Accès refusé."},{status:403});const {id}=await params;const body=await request.json();if(typeof body.approved!=="boolean")return NextResponse.json({error:"Valeur invalide."},{status:400});await db.restaurant.update({where:{id},data:{isApproved:body.approved}});return NextResponse.json({ok:true});}
