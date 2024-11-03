import { createDonation, getDonations, insertDonationSchema } from "@/lib/models/donations";


export type DepositTransaction = {
    date: string
    txid: string
    beefTx: string
    vout: number
    txType: 'deposit'
    amount: number
  }
  
  const mockDepositHistory: DepositTransaction[] = [
    {
      date: '2023-05-15T10:30:00',
      txid: '1a2b3c4d5e6f7g8h9i0j',
      beefTx: 'beef1234567890abcdef',
      vout: 0,
      txType: 'deposit',
      amount: 1000000 
    },
    {
      date: '2023-05-14T14:45:00',
      txid: '2b3c4d5e6f7g8h9i0j1a',
      beefTx: 'beef0987654321fedcba',
      vout: 1,
      txType: 'deposit',
      amount: 500000 
    },
    {
      date: '2023-05-13T09:15:00',
      txid: '3c4d5e6f7g8h9i0j1a2b',
      beefTx: 'beef2468135790acegik',
      vout: 2,
      txType: 'deposit',
      amount: 750000 
    },
  ]

export async function POST(request: Request) {
    // TODO: Add auth
    const body = await request.json();
    const donation = insertDonationSchema.parse(body);
    const createdDonation = await createDonation(donation);
    return Response.json(createdDonation);
}

export async function GET(request: Request) {
    // // TODO: Add auth
    // const { searchParams } = new URL(request.url);

    // // TODO: Get userId from auth
    // const userId = searchParams.get('userId');
    // if (!userId) {
    //     return Response.json({ error: 'userId is required' }, { status: 400 });
    // }
    // const donations = await getDonations(userId);
    // // TODO: Add pagination
    // return Response.json(donations);
    return Response.json(mockDepositHistory);
}