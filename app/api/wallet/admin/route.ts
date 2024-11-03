

export async function GET(request: Request) {
    // const address = process.env.ADMIN_WALLET_ADDRESS;
    const address = "0x1234DemoAddress";
    if (!address) {
        return Response.json({ error: 'ADMIN_WALLET_ADDRESS is not set' }, { status: 500 });
    }
    return Response.json({ address });
}