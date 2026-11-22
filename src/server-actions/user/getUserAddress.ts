import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { address } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserAddress() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        addresses: [],
        message: "You must be logged in.",
      };
    }

    const addresses = await db
      .select({
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      })
      .from(address)
      .where(eq(address.userId, currentUser.id))
      .orderBy(desc(address.createdAt));

    return {
      success: true,
      addresses,
    };
  } catch (error) {
    console.error("GET_USER_ADDRESSES_ERROR:", error);

    return {
      success: false,
      addresses: [],
      message: "Failed to fetch addresses.",
    };
  }
}
