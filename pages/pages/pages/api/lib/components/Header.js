import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import DashboardCards from '../components/DashboardCards'
import LeadTable from '../components/LeadTable'
import GeneratePromptModal from '../components/GeneratePromptModal'

export default function Home() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Carregar leads do Supabase ao iniciar
  useEffect(() => {
    carregarLeads()
  }, [])

  const carregarLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar leads:', error)
    } else {
      setLeads(data || [])
    }
  }

  const buscarLeads = async () => {
    if (!searchQuery || !searchLocation) {
      alert('Preencha a consulta e a localização!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, location: searchLocation })
      })

      const data = await response.json()

      if (data.success && data.leads.length > 0) {
        // Salvar cada lead no Supabase com status "Novo"
        for (const lead of data.leads) {
          const { error } = await supabase
            .from('leads')
            .insert([{
              nome: lead.nome,
              telefone: lead.telefone,
              endereco: lead.endereco,
              status: 'Novo',
              segmento: searchQuery,
              valor_fechado: 0
            }])
          if (error) console.error('Erro ao salvar lead:', error)
        }
        await carregarLeads()
        alert(`${data.leads.length} leads encontrados e salvos!`)
      } else {
        alert('Nenhum lead encontrado ou erro na busca.')
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      alert('Erro ao buscar leads. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatus = async (index, novoStatus, valor = 0) => {
    const lead = leads[index]
    if (!lead) return

    const updates = { status: novoStatus }
    if (novoStatus === 'Fechou') {
      updates.valor_fechado = valor
    }

    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', lead.id)

    if (error) {
      console.error('Erro ao atualizar status:', error)
    } else {
      await carregarLeads()
    }
  }

  // Calcular métricas para os cards
  const total = leads.length
  const contatados = leads.filter(l => l.status === 'Contatado' || l.status === 'Aceitou' || l.status === 'Fechou').length
  const aceitaram = leads.filter(l => l.status === 'Aceitou' || l.status === 'Fechou').length
  const fechados = leads.filter(l => l.status === 'Fechou').length
  const faturamento = leads.reduce((acc, l) => acc + (l.valor_fechado || 0), 0)

  return (
    <div style={{ padding: '0 32px 60px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <Header />

      {/* Painel de Busca (Hunter) */}
      <div className="neon-card" style={{ padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Ex: Advogado, Dentista, Imobiliária..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: '4px',
                color: '#e0e0ff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input
              type="text"
              placeholder="📍 Cidade, UF"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: '4px',
                color: '#e0e0ff',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            className="btn-neon"
            onClick={buscarLeads}
            disabled={loading}
            style={{ padding: '12px 32px', fontSize: '1rem', minWidth: '150px' }}
          >
            {loading ? '⏳ BUSCANDO...' : '⚡ CAÇAR LEADS'}
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards
        total={total}
        contatados={contatados}
        aceitaram={aceitaram}
        fechados={fechados}
        faturamento={faturamento}
      />

      {/* Tabela de Leads */}
      <LeadTable
        leads={leads}
        onStatusChange={atualizarStatus}
      />

      {/* Modal de Geração de Prompt */}
      {showModal && selectedLead && (
        <GeneratePromptModal
          lead={selectedLead}
          onClose={() => {
            setShowModal(false)
            setSelectedLead(null)
          }}
        />
      )}
    </div>
  )
}
