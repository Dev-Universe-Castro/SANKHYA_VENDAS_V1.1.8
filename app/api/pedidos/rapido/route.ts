
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
    const { pedido } = await request.json();

    console.log('🔄 [API Rápido] Salvando pedido rápido');

    const { pedidoRapidoService } = await import('@/lib/pedido-rapido-service');
    
    const result = await pedidoRapidoService.salvarPedidoRapido(
      pedido,
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
    console.error('❌ [API Rápido] Erro:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erro ao salvar pedido'
      },
      { status: 500 }
    );
  }
}
