
-- Adicionar colunas necessárias para unidades e descontos em AD_ADLEADSPRODUTOS
ALTER TABLE AD_ADLEADSPRODUTOS ADD (
  CODVOL VARCHAR2(10),
  PERCDESC NUMBER(15,2) DEFAULT 0
);

-- Adicionar comentários
COMMENT ON COLUMN AD_ADLEADSPRODUTOS.CODVOL IS 'Código da unidade/volume do produto';
COMMENT ON COLUMN AD_ADLEADSPRODUTOS.PERCDESC IS 'Percentual de desconto aplicado';
