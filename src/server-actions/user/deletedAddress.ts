"use server";
import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { address } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteAddress(addressId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to delete an address.",
      };
    }

    const [existingAddress] = await db
      .select({
        id: address.id,
      })
      .from(address)
      .where(and(eq(address.id, addressId), eq(address.userId, currentUser.id)))
      .limit(1);

    if (!existingAddress) {
      return {
        success: false,
        message: "Address not found.",
      };
    }

    await db
      .delete(address)
      .where(
        and(eq(address.id, addressId), eq(address.userId, currentUser.id)),
      );

    return {
      success: true,
      message: "Address deleted successfully",
    };
  } catch (error) {
    console.error("DELETE_ADDRESS_ERROR:", error);

    return {
      success: false,
      message: "Failed to delete address",
    };
  }
}
