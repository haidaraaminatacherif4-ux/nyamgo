import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request:NextRequest){const user=await requireRole(["RESTAURANT"]);if(!user?.restaurant)return NextResponse.json({error:"Accès refusé."},{status:403});const parsed=z.object({name:z.string().min(2),description:z.string().min(3),category:z.string().min(2),price:z.coerce.number().int().nonnegative(),imageUrl:z.string().url()}).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Informations invalides."},{status:400});const item=await db.menuItem.create({data:{...parsed.data,restaurantId:user.restaurant.id}});return NextResponse.json({item},{status:201});}
export async function PATCH(request:NextRequest){const user=await requireRole(["RESTAURANT"]);if(!user?.restaurant)return NextResponse.json({error:"Accès refusé."},{status:403});const parsed=z.object({isOpen:z.boolean(),isApproved:z.boolean().optional()}).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Informations invalides."},{status:400});const restaurant=await db.restaurant.update({where:{id:user.restaurant.id},data:{isOpen:parsed.data.isOpen}});return NextResponse.json({restaurant});}
