"use client"

import { useGetAllPayment } from "@/hooks";

const PaymentList = () => {
    const { data, isLoading, isError } = useGetAllPayment();
    console.log(data)
    return (
        <div>
            <h1>Payment List</h1>
        </div>
    );
};

export default PaymentList;