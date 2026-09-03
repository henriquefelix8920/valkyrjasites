import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { query, location } = req.body

  if (!query || !location) {
    return res.status(400).json({ error: 'Informe a consulta e a localização' })
  }

  try {
    const searchTerm = `${query} ${location}`
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchTerm)}`

    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        zone: 'serp_api1',
        url: url,
        format: 'raw',
        data_format: 'html'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BRIGHT_DATA_API_KEY}`
        }
      }
    )

    // Aqui a gente recebe o HTML e extrai os dados (nome, telefone, endereço)
    // Por enquanto, vamos simular alguns leads para você testar
    // Depois a gente implementa o parser completo do HTML
    const leads = [
      {
        nome: 'Dra. Ana Paula Souza',
        telefone: '(11) 91234-5678',
        endereco: 'Av. Paulista, 1000, São Paulo - SP'
      },
      {
        nome: 'Dr. Marcos Ribeiro',
        telefone: '(11) 98765-4321',
        endereco: 'Rua Augusta, 500, São Paulo - SP'
      },
      {
        nome: 'Clínica Odonto Excellence',
        telefone: '(11) 97654-3210',
        endereco: 'Alameda Santos, 200, São Paulo - SP'
      }
    ]

    return res.status(200).json({ success: true, leads })

  } catch (error) {
    console.error('Erro na busca:', error)
    return res.status(500).json({ error: 'Erro ao buscar leads no Google Maps' })
  }
}
