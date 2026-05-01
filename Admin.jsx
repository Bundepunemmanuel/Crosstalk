import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { supabase, getPageVisitStats, setUserSubscribed } from './supabase'

const ADMIN_EMAIL = 'bundepunemmanuel@gmail.com'

export default function Admin({ user }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0 })
  const [loading, setLoading] = useState(true)
  const [creditInputs, setCreditInputs] = useState({})
  const [actionMsg, setActionMsg] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) { navigate('/dashboard'); return }
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const [usersRes, visitsRes] = await Promise.all([
      supabase.from('profiles').select('*, conversions(count)').order('created_at', { ascending: false }),
      getPageVisitStats()
    ])
    setUsers(usersRes.data || [])
    setStats(visitsRes)
    setLoading(false)
  }

  const addCredits = async (userId, email) => {
    const amount = parseInt(creditInputs[userId] || '0')
    if (!amount || amount <= 0) { setActionMsg('Enter a valid credit amount.'); return }

    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single()
    const newCredits = (profile?.credits || 0) + amount
    const { error } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', userId)

    if (error) { setActionMsg('Failed to add credits.'); return }
    setActionMsg(`✓ Added ${amount} credits to ${email}`)
    setCreditInputs(prev => ({ ...prev, [userId]: '' }))
    loadData()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const toggleSubscription = async (userId, currentStatus, email) => {
    const { error } = await setUserSubscribed(userId, !currentStatus)
    if (error) { setActionMsg('Failed to update subscription.'); return }
    setActionMsg(`✓ ${!currentStatus ? 'Activated' : 'Deactivated'} subscription for ${email}`)
    loadData()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const subscribedCount = users.filter(u => u.is_subscribed).length
  const revenue = subscribedCount * 12
  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">Admin Panel</h1>
            <p className="text-white/30 text-sm font-mono">{ADMIN_EMAIL}</p>
          </div>
          <button onClick={loadData} className="btn-ghost text-sm py-2 px-4">Refresh</button>
        </div>

        {actionMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
            {actionMsg}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total users', value: users.length },
            { label: 'Active subscribers', value: subscribedCount },
            { label: 'Monthly revenue', value: `$${revenue}` },
            { label: 'Visits today', value: stats.today },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="font-display font-bold text-3xl text-white mb-1">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Page visits */}
        <div className="card mb-8">
          <h2 className="font-display font-semibold text-white text-lg mb-4">Landing page visits</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Today', value: stats.today },
              { label: 'This week', value: stats.week },
              { label: 'All time', value: stats.total },
            ].map(s => (
              <div key={s.label} className="bg-dark-700 rounded-xl p-4">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-white/30 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-3">
            Signup conversion rate: {users.length > 0 && stats.total > 0
              ? `${((users.length / stats.total) * 100).toFixed(1)}%`
              : '—'}
          </p>
        </div>

        {/* Users table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Users</h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="input-field w-64 text-sm py-2 px-3"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Email', 'Status', 'Credits', 'Conversions', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-white/30 text-xs font-mono uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="text-white/70 text-xs font-mono">{u.email}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        u.is_subscribed
                          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : 'bg-white/5 text-white/30 border border-white/10'
                      }`}>
                        {u.is_subscribed ? 'Active' : 'Free'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white/50 text-xs font-mono">{u.credits || 0}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white/50 text-xs font-mono">
                        {u.conversions?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white/30 text-xs font-mono">{formatDate(u.created_at)}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Add credits */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="0"
                            value={creditInputs[u.id] || ''}
                            onChange={e => setCreditInputs(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className="w-16 bg-dark-700 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-violet-500/50"
                          />
                          <button
                            onClick={() => addCredits(u.id, u.email)}
                            className="text-xs px-2 py-1 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-colors"
                          >
                            +Credits
                          </button>
                        </div>

                        {/* Toggle subscription */}
                        <button
                          onClick={() => toggleSubscription(u.id, u.is_subscribed, u.email)}
                          className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                            u.is_subscribed
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                              : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                          }`}
                        >
                          {u.is_subscribed ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <p className="text-center text-white/20 text-sm py-8">No users found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
