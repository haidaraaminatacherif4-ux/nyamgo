import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request:NextRequest){const user=await requireRole(["RESTAURANT"]);if(!user?.restaurant)return NextResponse.json({error:"Accès refusé."},{status:403});const parsed=z.object({caption:z.string().min(2).max(100),imageUrl:z.string().url()}).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Informations invalides."},{status:400});const story=await db.story.create({data:{...parsed.data,restaurantId:user.restaurant.id,expiresAt:new Date(Date.now()+24*60*60*1000)}});return NextResponse.json({story},{status:201});}
