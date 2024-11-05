import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ONE_HOUR_IN_MILLISECONDS = 3600000;

export const useDonation = () => {
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

    return {
        adminWallet,
        isLoading: isWalletPending,
        error: walletError,
    };
};
