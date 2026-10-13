
"use client";

import SingleAssetPurchaseDetails from "@/components/asset-purchase/admin/SingleAssetPurchaseDetails";
import { useParams } from "next/navigation";

export default function AssetPurchaseDetailsPage() {
  const params = useParams<{ id: string }>();

  const assetPurchaseId = params.id;

  return (
    <SingleAssetPurchaseDetails
      assetPurchaseId={assetPurchaseId}
    />
  );
}
