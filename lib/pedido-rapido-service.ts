
import { criarPedidoVenda, PedidoVenda } from './pedidos-service';
import { pedidosFDVService } from './pedidos-fdv-service';

/**
 * Serviço exclusivo para Pedidos Rápidos
 * NÃO vinculados a leads
 */
export const pedidoRapidoService = {
  /**
   * Salvar pedido rápido (sem lead)
   */
  async salvarPedidoRapido(pedido: PedidoVenda, idEmpresa: number, codUsuario: number, nomeUsuario: string): Promise<{ success: boolean; nunota?: number; error?: string; offline?: boolean }> {
    console.log('🚀 [Pedido Rápido] Iniciando criação...');
    console.log('📦 Dados do pedido:', {
      CODPARC: pedido.CODPARC,
      itensCount: pedido.itens.length,
      valorTotal: pedido.VLRNOTA
    });

    try {
      // 1. Registrar no controle FDV ANTES de tentar criar
      const idPedidoFDV = await pedidosFDVService.registrarPedido({
        ID_EMPRESA: idEmpresa,
        ORIGEM: 'RAPIDO',
        CORPO_JSON: pedido,
        STATUS: 'ERRO',
        TENTATIVAS: 1,
        CODUSUARIO: codUsuario,
        NOME_USUARIO: nomeUsuario
      });

      console.log('✅ [Pedido Rápido] Registrado no controle FDV com ID:', idPedidoFDV);

      // 2. Tentar criar pedido na API Sankhya
      const resultado = await criarPedidoVenda({
        ...pedido,
        idEmpresa
      });

      if (!resultado.success) {
        console.error('❌ [Pedido Rápido] Erro ao criar pedido:', resultado);

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

      console.log('✅ [Pedido Rápido] Pedido criado com NUNOTA:', resultado.nunota);

      // Atualizar status de sucesso no FDV
      await pedidosFDVService.atualizarStatus(
        idPedidoFDV,
        'SUCESSO',
        resultado.nunota
      );

      return {
        success: true,
        nunota: resultado.nunota
      };
    } catch (error: any) {
      console.error('❌ [Pedido Rápido] Erro inesperado:', error);

      return {
        success: false,
        error: error.message || 'Erro inesperado ao criar pedido',
        offline: false
      };
    }
  }
};
