
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Package } from "lucide-react"

interface ItemPedido {
  CODPROD: string
  DESCRPROD?: string
  QTDNEG: number
  VLRUNIT: number
  PERCDESC: number
  CODLOCALORIG: string
  CONTROLE: string
  AD_QTDBARRA?: number
  CODVOL?: string
  IDALIQICMS?: string
  SEQUENCIA?: number
  VLRDESC?: number
  VLRTOT?: number
  MARCA?: string
  UNIDADE?: string
}

interface PedidoItensManagerProps {
  itens: ItemPedido[]
  onEditarItem: (index: number) => void
  onRemoverItem: (index: number) => void
  formatCurrency: (value: number) => string
  calcularTotal: (item: ItemPedido) => number
}

export function PedidoItensManager({
  itens,
  onEditarItem,
  onRemoverItem,
  formatCurrency,
  calcularTotal
}: PedidoItensManagerProps) {
  
  if (!Array.isArray(itens) || itens.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum item adicionado ao pedido</p>
            <p className="text-xs mt-1">Use o catálogo para adicionar produtos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop - Tabela */}
      <Card className="border-green-200 hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead className="text-xs font-semibold text-green-800">Produto</TableHead>
                  <TableHead className="text-xs font-semibold text-green-800 text-center">Qtd</TableHead>
                  <TableHead className="text-xs font-semibold text-green-800 text-right">Vlr. Unit.</TableHead>
                  <TableHead className="text-xs font-semibold text-green-800 text-center">Desc %</TableHead>
                  <TableHead className="text-xs font-semibold text-green-800 text-right">Total</TableHead>
                  <TableHead className="text-xs font-semibold text-green-800 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="text-xs">
                      <div>
                        <div className="font-medium">{item.DESCRPROD}</div>
                        <div className="text-[10px] text-muted-foreground">Cód: {item.CODPROD}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-center font-medium">{item.QTDNEG}</TableCell>
                    <TableCell className="text-xs text-right">{formatCurrency(item.VLRUNIT)}</TableCell>
                    <TableCell className="text-xs text-center">
                      {item.PERCDESC > 0 ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {item.PERCDESC}%
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-right font-semibold text-green-700">
                      {formatCurrency(calcularTotal(item))}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEditarItem(index)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => onRemoverItem(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile - Cards */}
      <div className="md:hidden space-y-2">
        {itens.map((item, index) => (
          <Card key={index} className="border-green-200">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.DESCRPROD}
                  </p>
                  <p className="text-xs text-muted-foreground">Cód: {item.CODPROD}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEditarItem(index)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:text-red-700"
                    onClick={() => onRemoverItem(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qtd:</span>
                  <span className="font-medium">{item.QTDNEG}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vlr. Unit:</span>
                  <span className="font-medium">{formatCurrency(item.VLRUNIT)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desc:</span>
                  {item.PERCDESC > 0 ? (
                    <Badge variant="outline" className="text-orange-600 border-orange-300 h-5 text-[10px]">
                      {item.PERCDESC}%
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-green-700">{formatCurrency(calcularTotal(item))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
