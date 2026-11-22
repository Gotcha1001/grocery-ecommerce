import { deleteAddress } from "@/server-actions/user/deletedAddress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

interface DeleteAddressButtonProps {
  addressId: string;
}

export default function DeleteAddressButton({
  addressId,
}: DeleteAddressButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this address?");

    if (!confirmed) return;

    setIsDeleting(true);

    const result = await deleteAddress(addressId);

    if (!result.success) {
      toast.error(result.message);
      setIsDeleting(false);
      return;
    }
    toast.success(result.message);

    router.refresh();

    setIsDeleting(false);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="mr-3 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-red-50 hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiTrash2 size={16} />
    </button>
  );
}
