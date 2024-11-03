import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createAndSendTransaction } from "@/lib/wallet/transactions";

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export const useDonation = () => {
    const {
        data: donations,
        isPending: isDonationPending,
        error: donationError,
    } = useQuery({
        queryKey: ["donation"],
        queryFn: async () => {
            const response = await axios.get(`/api/donation`);
            return response.data;
        },
        staleTime: ONE_HOUR_IN_MILLISECONDS,
        refetchInterval: ONE_HOUR_IN_MILLISECONDS,
    });

    const {
        data: adminWallet,
        isPending: isWalletPending,
        error: walletError,
    } = useQuery({
        queryKey: ["adminWallet"],
        queryFn: async () => {
            const response = await axios.get(`/api/wallet/admin`);
            return response.data;
        },
        staleTime: ONE_HOUR_IN_MILLISECONDS,
        refetchInterval: ONE_HOUR_IN_MILLISECONDS,
    });

    const donate = async (amount: number, address: string, wif: string) => {
        try {
            const txid = await createAndSendTransaction(wif, address, amount);
            console.log("Transaction sent:", txid);

            const response = await axios.post(`/api/donation`, { amount, address, txid });

            return response.data;
        } catch (error) {
            console.error("Error sending transaction:", error);
        }
    };

    return {
        donate,
        donations,
        adminWallet,
        isLoading: isDonationPending || isWalletPending,
        error: donationError || walletError,
    };
};
