"use client";
import { useState } from "react";
import AddressModal from "./AddressModal";
import { Address } from "./CheckoutPageComponent";
import DeleteAddressButton from "./DeleteAddressButton";

interface DeliveryAddressProps {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

export default function DeliveryAddress({
  addresses,
  selectedAddress,
  setSelectedAddress,
}: DeliveryAddressProps) {
  const [showAddress, setShowAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  return (
    <div>
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
      <p className="text-sm font-medium uppercase text-text">
        Delivery Address
      </p>

      <div className="relative mt-2 flex items-start justify-between gap-3">
        {selectedAddress ? (
          <p className="text-sm text-muted">
            {selectedAddress.street},{selectedAddress.city},{" "}
            {selectedAddress.state}
          </p>
        ) : (
          <p className="text-sm text-muted">No address found</p>
        )}

        <button
          type="button"
          onClick={() => setShowAddress((prev) => !prev)}
          className="cursor-pointer text-sm font-medium text-primary ..."
        >
          Change
        </button>

        {showAddress && (
          <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border bg-white shadow-lg">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  className="flex items-center justify-between gap-3 border-b border-border"
                  key={address.id}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="block w-full cursor-pointer bg-white p-3 text-left text-sm text-text hover:bg-gray-50"
                  >
                    <p>
                      {address.street},{address.city}, {address.state}
                    </p>
                    {address.id === selectedAddress?.id && (
                      <span className="mt-1 block text-xs font-medium text-primary">
                        Selected
                      </span>
                    )}
                  </button>{" "}
                  <DeleteAddressButton addressId={address.id} />
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-muted">
                No saved addresses
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              className="block w-full cursor-pointer border-t border-border bg-white p-3 text-left text-sm font-medium text-primary hover:bg-gray-50"
            >
              + Add New Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
