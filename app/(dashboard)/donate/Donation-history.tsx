"use client";
import { DepositHistoryTable, LoadingState } from "@/components/AdminTreasuryHistory";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useDonation } from "@/hooks/useDonation";

export default function DonationHistory() {
    const { donations, isLoading } = useDonation();

    if (isLoading) return <LoadingState />;

    return (
        <div className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <DepositHistoryTable depositHistory={donations} />
        </div>
    );
}