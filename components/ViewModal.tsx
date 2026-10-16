import React, { useMemo, useRef } from 'react';
import { Post } from '../types';
import { getPosturaStyle } from '../constants';
import { X, MapPin, User, Calendar, Clock, Pencil, BookOpen } from 'lucide-react';
import { useModal } from './useModal';
import { sanitizeContent } from './richText';

interface ViewModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (post: Post) => void;
}

export default function ViewModal({ post, isOpen, onClose, onEdit }: ViewModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  useModal(isOpen, panel, onClose);
  const content = useMemo(() => sanitizeContent(post?.content || ''), [post?.content]);
  if (!isOpen || !post) return null;
  const style = getPosturaStyle(post.postura);
  const text = new DOMParser().parseFromString(content, 'text/html').body.textContent || '';
  const minutes = Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="reading-title" tabIndex={-1} className="reading-panel">
        <div className="reading-toolbar">
          <span className="reading-mode"><BookOpen size={18} /> Espaço de leitura</span>
          <div className="flex items-center gap-2">
            {onEdit && <button onClick={() => onEdit(post)} className="reading-edit"><Pencil size={16} /> Editar</button>}
            <button onClick={onClose} className="modal-close" aria-label="Fechar leitura"><X size={21} /></button>
          </div>
        </div>
        <div className="reading-scroll custom-scrollbar">
          <div className="reading-document">
            <div className="reading-badges">
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`}>{post.postura}</span>
              <span className="text-xs font-semibold text-slate-500">{post.type}</span>
              <span className="reading-time"><Clock size={14} /> {minutes} min de leitura</span>
            </div>
            <h2 id="reading-title">{post.title}</h2>
            <div className="reading-metadata">
              <span><User size={16} /> {post.author || 'Anônimo'}</span>
              <span><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              {post.address && <span className="reading-address"><MapPin size={16} /> {post.address}</span>}
            </div>
            <article className="reading-content" lang="pt-BR" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <footer className="reading-footer">Fiscais SP · Conhecimento compartilhado, atuação fortalecida.</footer>
        </div>
      </div>
    </div>
  );
}
