
import { criarPedidoVenda, PedidoVenda } from './pedidos-service';
import { pedidosFDVService } from './pedidos-fdv-service';

/**
 * Serviço exclusivo para Pedidos vinculados a Leads
 */
export const pedidoLeadService = {
  /**
   * Salvar pedido vinculado a lead
   */
  async salvarPedidoLead(
    pedido: PedidoVenda & { CODLEAD: string },
    idEmpresa: number,
    codUsuario: number,
    nomeUsuario: string
  ): Promise<{ success: boolean; nunota?: number; error?: string; offline?: boolean }> {
    console.log('🚀 [Pedido Lead] Iniciando criação para lead:', pedido.CODLEAD);
    console.log('📦 Dados do pedido:', {
      CODLEAD: pedido.CODLEAD,
      CODPARC: pedido.CODPARC,
      itensCount: pedido.itens.length,
      valorTotal: pedido.VLRNOTA
    });

    try {
      // 1. Registrar no controle FDV ANTES de tentar criar
      const idPedidoFDV = await pedidosFDVService.registrarPedido({
        ID_EMPRESA: idEmpresa,
        ORIGEM: 'LEAD',
        CODLEAD: Number(pedido.CODLEAD),
        CORPO_JSON: pedido,
        STATUS: 'ERRO',
        TENTATIVAS: 1,
        CODUSUARIO: codUsuario,
        NOME_USUARIO: nomeUsuario
      });

      console.log('✅ [Pedido Lead] Registrado no controle FDV com ID:', idPedidoFDV);

      // 2. Tentar criar pedido na API Sankhya
      const resultado = await criarPedidoVenda({
        ...pedido,
        idEmpresa
      });

      if (!resultado.success) {
        console.error('❌ [Pedido Lead] Erro ao criar pedido:', resultado);

        // Atualizar status no FDV
        await pedidosFDVService.atualizarStatus(
          idPedidoFDV,
          'ERRO',
          undefined,
          resultado.error || 'Erro desconhecido'
        );

        return {
          success: false,
          error: resultado.error || 'Erro ao criar pedido',
          offline: false
        };
      }

      console.log('✅ [Pedido Lead] Pedido criado com NUNOTA:', resultado.nunota);

      // Atualizar status de sucesso no FDV
      await pedidosFDVService.atualizarStatus(
        idPedidoFDV,
        'SUCESSO',
        resultado.nunota
      );

      // 3. Atualizar lead para GANHO
      try {
        console.log('🔄 [Pedido Lead] Atualizando lead para GANHO...');

        const responseStatus = await fetch('/api/leads/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codLead: String(pedido.CODLEAD),
            status: 'GANHO'
          })
        });

        if (!responseStatus.ok) {
          const errorData = await responseStatus.json();
          throw new Error(errorData.error || 'Erro ao atualizar status do lead');
        }

        console.log('✅ [Pedido Lead] Lead atualizado para GANHO');
      } catch (errorLead: any) {
        console.error('❌ [Pedido Lead] Erro ao atualizar lead:', errorLead);
        // Não falhar o pedido se o lead não for atualizado
        console.warn('⚠️ Pedido criado mas lead não foi atualizado');
      }

      return {
        success: true,
        nunota: resultado.nunota
      };
    } catch (error: any) {
      console.error('❌ [Pedido Lead] Erro inesperado:', error);

      return {
        success: false,
        error: error.message || 'Erro inesperado ao criar pedido',
        offline: false
      };
    }
  }
};
