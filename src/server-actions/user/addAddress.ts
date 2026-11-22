"use server";
import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { count, eq } from "drizzle-orm";
import { address } from "@/db/schema";

interface AddAddressData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  phone: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function addAddress(data: AddAddressData) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to add an address.",
      };
    }

    const fields = [
      data.firstName,
      data.lastName,
      data.city,
      data.phone,
      data.state,
      data.postalCode,
      data.country,
    ];

    const hasEmptyFields = fields.some((field) => !field || !field.trim());

    if (hasEmptyFields) {
      return {
        success: false,
        message: "All address fields are required.",
      };
    }

    // Ensure users dont have more than 3 addresses

    const [addressCount] = await db
      .select({
        count: count(),
      })
      .from(address)
      .where(eq(address.userId, currentUser.id));

    if (addressCount.count >= 3) {
      return {
        success: false,
        message: "You can only have up to 3 addresses.",
      };
    }

    const isDefault = addressCount.count === 0;

    // Save the address
    await db.insert(address).values({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      street: data.street.trim(),
      city: data.city.trim(),
      phone: data.phone.trim(),
      state: data.state.trim(),
      postalCode: data.postalCode.trim(),
      country: data.country.trim(),
      isDefault,
    });

    return {
      success: true,
      message: "Address added successfully.",
    };
  } catch (error) {
    console.error("ADD_ADDRESS_ERROR:", error);

    return {
      success: false,
      message: "Failed to add address.",
    };
  }
}
