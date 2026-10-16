import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Layers, Check, AlertCircle, Sparkles } from 'lucide-react';
import { ContentTypeItem } from '../types';
import { POSTURAS as DEFAULT_POSTURAS, CONTENT_TYPES as DEFAULT_CONTENT_TYPES, COLOR_PRESETS, getPosturaStyle } from '../constants';

interface ManageTaxonomiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  posturas: string[];
  contentTypes: ContentTypeItem[];
  onAddPostura: (name: string, colorPresetId?: string) => Promise<void>;
  onDeletePostura: (name: string) => Promise<void>;
  onAddContentType: (item: { value: string; label: string; color: string; iconBg: string; iconText: string }) => Promise<void>;
  onDeleteContentType: (value: string) => Promise<void>;
}

export default function ManageTaxonomiesModal({
  isOpen,
  onClose,
  posturas,
  contentTypes,
  onAddPostura,
  onDeletePostura,
  onAddContentType,
  onDeleteContentType
}: ManageTaxonomiesModalProps) {
  const [activeTab, setActiveTab] = useState<'posturas' | 'contentTypes'>('posturas');
  
  // Form states - Postura
  const [newPosturaName, setNewPosturaName] = useState('');
  const [selectedColorPreset, setSelectedColorPreset] = useState<string>(COLOR_PRESETS[0].id);
  const [isAddingPostura, setIsAddingPostura] = useState(false);
  const [posturaError, setPosturaError] = useState('');

  // Form states - ContentType
  const [newTypeLabel, setNewTypeLabel] = useState('');
  const [selectedTypeColorPreset, setSelectedTypeColorPreset] = useState<string>(COLOR_PRESETS[0].id);
  const [isAddingType, setIsAddingType] = useState(false);
  const [typeError, setTypeError] = useState('');

  if (!isOpen) return null;

  const defaultPosturaNames = DEFAULT_POSTURAS.map(p => p.toLowerCase());
  const defaultTypeValues = DEFAULT_CONTENT_TYPES.map(t => t.value.toLowerCase());

  const handleCreatePostura = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPosturaName.trim();
    if (!trimmed) {
      setPosturaError('Informe o nome da postura.');
      return;
    }

    if (posturas.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      setPosturaError('Já existe uma postura com este nome.');
      return;
    }

    setIsAddingPostura(true);
    setPosturaError('');
    try {
      await onAddPostura(trimmed, selectedColorPreset);
      setNewPosturaName('');
    } catch (err: any) {
      setPosturaError(err.message || 'Erro ao criar postura.');
    } finally {
      setIsAddingPostura(false);
    }
  };

  const handleCreateContentType = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTypeLabel.trim();
    if (!trimmed) {
      setTypeError('Informe o nome da classificação.');
      return;
    }

    if (contentTypes.some(t => t.value.toLowerCase() === trimmed.toLowerCase())) {
      setTypeError('Já existe um tipo com este nome.');
      return;
    }

    const preset = COLOR_PRESETS.find(p => p.id === selectedTypeColorPreset) || COLOR_PRESETS[0];

    setIsAddingType(true);
    setTypeError('');
    try {
      await onAddContentType({
        value: trimmed,
        label: trimmed,
        color: `${preset.bg} ${preset.text}`,
        iconBg: preset.bg,
        iconText: preset.iconColor
      });
      setNewTypeLabel('');
    } catch (err: any) {
      setTypeError(err.message || 'Erro ao criar tipo de classificação.');
    } finally {
      setIsAddingType(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header do Modal */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gerenciar Categorias</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Crie novas Posturas e Tipos sem mexer no código
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('posturas')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'posturas'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            Posturas / Temas ({posturas.filter(p => p !== 'Todas').length})
          </button>
          <button
            onClick={() => setActiveTab('contentTypes')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'contentTypes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Tag className="w-4 h-4" />
            Tipos de Registro ({contentTypes.filter(t => t.value !== 'Todas').length})
          </button>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {activeTab === 'posturas' ? (
            <div className="space-y-6">
              {/* Formulário para adicionar nova Postura */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Cadastrar Nova Postura
                </div>

                <form onSubmit={handleCreatePostura} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Nome da Postura / Tema
                    </label>
                    <input
                      type="text"
                      value={newPosturaName}
                      onChange={(e) => { setNewPosturaName(e.target.value); setPosturaError(''); }}
                      placeholder="Ex: Meio Ambiente, Trânsito, Vigilância Sanitária..."
                      className="w-full p-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Cor do Identificador
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedColorPreset(preset.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all border ${
                            selectedColorPreset === preset.id
                              ? `${preset.bg} ${preset.text} border-current ring-2 ring-indigo-400 scale-105`
                              : `${preset.bg} ${preset.text} border-transparent opacity-60 hover:opacity-100`
                          }`}
                        >
                          {selectedColorPreset === preset.id && <Check className="w-3 h-3" />}
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {posturaError && (
                    <div className="text-xs font-bold text-rose-500 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {posturaError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAddingPostura}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {isAddingPostura ? 'Adicionando...' : 'Adicionar Postura'}
                  </button>
                </form>
              </div>

              {/* Lista de Posturas cadastradas */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Posturas Ativas na Aplicação
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {posturas.filter(p => p !== 'Todas').map((postura) => {
                    const isDefault = defaultPosturaNames.includes(postura.toLowerCase());
                    const style = getPosturaStyle(postura);
                    return (
                      <div
                        key={postura}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${style.bg} border ${style.border}`}></span>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                            {postura}
                          </span>
                          {isDefault ? (
                            <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-bold uppercase">
                              Padrão
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-bold uppercase">
                              Criada
                            </span>
                          )}
                        </div>

                        {!isDefault && (
                          <button
                            onClick={() => {
                              if (confirm(`Excluir a postura "${postura}"? Registros já cadastrados com ela continuarão visíveis.`)) {
                                onDeletePostura(postura);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir postura personalizada"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Formulário para adicionar novo Tipo de Classificação */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Cadastrar Novo Tipo de Classificação
                </div>

                <form onSubmit={handleCreateContentType} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Nome da Classificação
                    </label>
                    <input
                      type="text"
                      value={newTypeLabel}
                      onChange={(e) => { setNewTypeLabel(e.target.value); setTypeError(''); }}
                      placeholder="Ex: Legislação, Pareceres Técnicos, Jurisprudência..."
                      className="w-full p-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Estilo Visual
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedTypeColorPreset(preset.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all border ${
                            selectedTypeColorPreset === preset.id
                              ? `${preset.bg} ${preset.text} border-current ring-2 ring-indigo-400 scale-105`
                              : `${preset.bg} ${preset.text} border-transparent opacity-60 hover:opacity-100`
                          }`}
                        >
                          {selectedTypeColorPreset === preset.id && <Check className="w-3 h-3" />}
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {typeError && (
                    <div className="text-xs font-bold text-rose-500 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {typeError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAddingType}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {isAddingType ? 'Adicionando...' : 'Adicionar Tipo de Registro'}
                  </button>
                </form>
              </div>

              {/* Lista de Tipos de Conteúdo */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Tipos de Registro Disponíveis
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {contentTypes.filter(t => t.value !== 'Todas').map((type) => {
                    const isDefault = defaultTypeValues.includes(type.value.toLowerCase());
                    return (
                      <div
                        key={type.value}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${type.color} border border-current`}>
                            {type.label}
                          </span>
                          {isDefault ? (
                            <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-bold uppercase">
                              Padrão
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-bold uppercase">
                              Criado
                            </span>
                          )}
                        </div>

                        {!isDefault && (
                          <button
                            onClick={() => {
                              if (confirm(`Excluir o tipo "${type.label}"?`)) {
                                onDeleteContentType(type.value);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir tipo de registro personalizado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Rodapé com botão Fechar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
