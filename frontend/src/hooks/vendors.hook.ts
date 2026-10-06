import { useQuery } from "@tanstack/react-query";
import { getAllVendors } from "@/api";

// Get All Vendors
export const useGetAllVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => getAllVendors()
  });
};