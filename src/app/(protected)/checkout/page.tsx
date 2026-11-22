import CheckoutPageComponent from "@/components/checkout/CheckoutPageComponent";
import FrontendLayout from "@/components/layouts/FrontendLayout";
import { getUserAddress } from "@/server-actions/user/getUserAddress";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const result = await getUserAddress();

  const addresses = result.success ? result.addresses : [];

  return (
    <FrontendLayout>
      <CheckoutPageComponent addresses={addresses} />
    </FrontendLayout>
  );
}
