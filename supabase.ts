import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our data
export interface Agent {
  id: string
  name: string
  role: string
  enabled: boolean
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  agent_id?: string
  agent_name?: string
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  agent_name: string
  status: 'Draft' | 'Needs Approval' | 'Approved'
  preview: string
  created_at: string
  updated_at: string
}

// Database functions
export const fetchAgents = async (): Promise<Agent[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('enabled', true)
    .order('name')

  if (error) {
    console.error('Error fetching agents:', error)
    throw error
  }

  return data || []
}

export const fetchMessages = async (limit = 50): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching messages:', error)
    throw error
  }

  return data || []
}

export const createMessage = async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    throw error
  }

  return data
}

export const fetchTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tickets:', error)
    throw error
  }

  return data || []
}

export const updateTicketStatus = async (id: string, status: Ticket['status']): Promise<void> => {
  const { error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating ticket:', error)
    throw error
  }
}