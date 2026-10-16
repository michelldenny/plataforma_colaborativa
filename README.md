# Fiscais SP · Base colaborativa

## Iniciar no computador

Requer Node.js 22 ou superior.

1. Abra um terminal nesta pasta.
2. Execute `npm ci` para instalar as dependências.
3. Execute `npm run dev`.
4. Abra http://localhost:3000 para acessar o sistema.

Para experimentar apenas a interface, abra http://localhost:3000/preview.html. Essa prévia usa dados fictícios e guarda alterações somente em memória, até atualizar a página. Não acessa o Firebase.

## Verificações e publicação

- `npm run typecheck`: verifica os tipos do código.
- `npm run build`: gera a pasta `dist` para hospedagem estática.
- `npm run preview`: permite conferir a compilação localmente.

A configuração de conexão existente está em `firebase.ts`. O sistema principal usa o projeto Firebase original e suas regras de acesso. A prévia é independente. Estilos utilitários e fontes continuam dependendo dos serviços externos já utilizados pelo projeto (Tailwind CDN e Google Fonts).

## Melhorias desta versão

- Popup de leitura com largura confortável, altura adaptável e rolagem própria.
- Títulos, endereços e links extensos quebram de linha sem esconder informações.
- Parágrafos, destaques, listas do Quill, imagens e tabelas com apresentação consistente.
- Remoção de layouts colados e HTML executável na apresentação do conteúdo, sem alterar o registro salvo.
- Cards com títulos completos e resumo de conteúdo; filtros organizados em várias linhas.
- Busca ignora acentos e encontra autores, além de título, descrição e endereço.
- Navegação dos popups pelo teclado, fechamento com Escape e retorno do foco.
- Validação de título, autor e descrição; mensagens de erro visíveis; botão de salvar ligado ao formulário.
- Endereço pode ser apagado durante a edição e salvo corretamente.
- Falha de carregamento informada ao usuário.

## Limites da verificação

Compilação e verificação de tipos foram executadas. A interface foi conferida com dados fictícios em larguras de computador e celular. Não foram executadas operações de gravação ou exclusão na base real. A integração Firebase precisa ser conferida no ambiente de uso com as permissões correspondentes.
