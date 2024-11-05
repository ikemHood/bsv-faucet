

export async function GET(request: Request) {
    // const address = process.env.ADMIN_WALLET_ADDRESS;
    const address = "mgqipciCS56nCYSjB1vTcDGskN82yxfo1G";
    if (!address) {
        return Response.json({ error: 'ADMIN_WALLET_ADDRESS is not set' }, { status: 500 });
    }
    return Response.json({ address });
}