
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = JSON.parse(decodeURIComponent(userCookie.value));
    const { pedido, codLead } = await request.json();

    console.log('🔄 [API Lead] Salvando pedido de lead:', { codLead });

    const { pedidoLeadService } = await import('@/lib/pedido-lead-service');
    
    const result = await pedidoLeadService.salvarPedidoLead(
      { ...pedido, CODLEAD: codLead },
      user.ID_EMPRESA || 1,
      user.id || 0,
      user.name || 'Sistema'
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          offline: result.offline,
          validationError: true
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      nunota: result.nunota
    });

  } catch (error: any) {
    console.error('❌ [API Lead] Erro:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erro ao salvar pedido'
      },
      { status: 500 }
    );
  }
}
