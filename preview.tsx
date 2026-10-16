import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ViewModal from './components/ViewModal';
import CreateModal from './components/CreateModal';
import PostCard from './components/PostCard';
import { Post } from './types';
const example: Post = {
  id: 'demonstracao', postura: 'Obras', type: 'Resumo', subprefeitura: 'penha', author: 'Equipe de fiscalização · Exemplo', createdAt: Date.now(),
  title: 'Orientações para o registro de vistorias e o compartilhamento de informações',
  address: 'Exemplo de endereço extenso: Avenida de referência, 1234, complemento e informações adicionais sobre a localização da vistoria, São Paulo',
  content: `<h2>Uma leitura mais clara, do início ao fim</h2><p>Este é um registro fictício para conferir a apresentação dos textos. A janela se adapta ao espaço disponível e mantém o conteúdo acessível por rolagem, mesmo em telas pequenas.</p><p><strong>Destaque:</strong> o conteúdo mantém parágrafos, <em>ênfases</em>, <u>sublinhados</u> e cores do editor.</p><h3>Antes da vistoria</h3><ol><li data-list="ordered">Consulte as informações do registro.</li><li data-list="ordered">Confira o endereço completo e as observações.</li><li data-list="bullet">Compartilhe aprendizados relevantes com a equipe.</li></ol><blockquote>Informações organizadas facilitam a consulta e a colaboração.</blockquote><p>Também é possível exibir referências longas sem perder o texto:</p><p><a href="https://example.com/${'referencia'.repeat(30)}">https://example.com/${'referencia'.repeat(30)}</a></p>${'<p>Parágrafo de demonstração para verificar a rolagem. Os títulos, listas e informações do registro permanecem legíveis, com espaçamento consistente entre os blocos de conteúdo.</p>'.repeat(10)}<p><strong>Fim do registro de demonstração.</strong></p>`
};
function Preview() {
  const [reading, setReading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [post, setPost] = useState(example);
  return <div className="app-shell min-h-screen p-6 md:p-12"><main className="max-w-5xl mx-auto"><div className="portal-intro"><span>PRÉVIA INTERATIVA · DADOS FICTÍCIOS</span><h2>Conhecimento para todos.</h2><p>Confira a leitura e a edição. As alterações desta prévia ficam apenas nesta tela.</p></div><div className="max-w-sm"><PostCard post={post} onView={() => setReading(true)} onEdit={() => setEditing(true)} onDelete={() => {}} /></div><ViewModal isOpen={reading} post={post} onClose={() => setReading(false)} onEdit={() => { setReading(false); setEditing(true); }} /><CreateModal isOpen={editing} onClose={() => setEditing(false)} onSubmit={async data => { setPost(data); setEditing(false); setReading(true); }} defaultSubprefeitura="penha" defaultPostura="Obras" initialData={post} /></main></div>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
