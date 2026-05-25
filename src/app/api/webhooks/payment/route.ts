import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '../../../../services/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // We expect basic parameters for the webhook payload
    const { landingPageId, status, amount, method } = body;

    if (!landingPageId || !status) {
      return NextResponse.json(
        { error: 'Parâmetros ausentes (landingPageId, status são obrigatórios)' }, 
        { status: 400 }
      );
    }

    // Process only if status is approved/paid
    if (status === 'approved' || status === 'paid') {
      // 1. Fetch all clients and find matching
      const clients = await dbService.getLandingPages();
      const matchedClient = clients.find(c => c.id === landingPageId);

      if (!matchedClient) {
        return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
      }

      // 2. Update client page status to Active
      await dbService.saveLandingPage({
        id: matchedClient.id,
        slug: matchedClient.slug,
        status: 'active'
      });

      // 3. Save payment entry into the history
      await dbService.savePayment({
        landingPageId,
        clientName: matchedClient.name,
        amount: Number(amount) || 35.00,
        status: 'approved',
        method: method || 'pix',
        vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // extend 30 days
      });

      return NextResponse.json({ 
        success: true, 
        message: `Webhook processado com sucesso. Acesso da landing page "${matchedClient.name}" liberado por 30 dias.` 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Webhook recebido com status: "${status}". Nenhuma ação de liberação necessária.` 
    });

  } catch (err: any) {
    console.error('Webhook error', err);
    return NextResponse.json({ error: err.message || 'Erro ao processar webhook' }, { status: 500 });
  }
}

// Support GET requests just to show endpoint is online
export async function GET() {
  return NextResponse.json({ 
    status: 'online', 
    message: 'IPTV SaaS Payment Webhook is online. Send POST requests to test.' 
  });
}
