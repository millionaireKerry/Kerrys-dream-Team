import { createClient } from '@supabase/supabase-js';

// ----- Client -----
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ----- Types (match your tables) -----
export type Agent = {
  id: string;                 // e.g. 'supervisor', 'founder', 'alex', ...
  name: string;               // e.g. 'Dotty'
  role: string;               // e.g. 'Supervisor'
  enabled?: boolean | null;
  image_url?: string | null;  // '/dottysupervisor.png' etc.
};

export type Message = {
  id: string;                 // uuid
  role: 'user' | 'agent';
  content: string;
  agent_id: string | null;    // which agent the message relates to (null for user)
  agent_name: string | null;  // display name for UI
  created_at: string;         // timestamp
};

export type TicketStatus = 'Needs Approval' | 'Draft' | 'Approved';

export type Ticket = {
  id: string;                 // uuid
  title: string | null;
  preview: string | null;
  agent_name: string | null;
  status: TicketStatus;
  created_at: string;         // timestamp
  updated_at: string | null;  // timestamp
};

// ----- Data access helpers -----

export async function fetchAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, role, enabled, image_url')
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMessages(limit = 200): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, agent_id, agent_name, created_at')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('id, title, preview, agent_name, status, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

type CreateMessageInput = {
  role: 'user' | 'agent';
  content: string;
  agent_id?: string | null;
  agent_name?: string | null;
};

export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      role: input.role,
      content: input.content,
      agent_id: input.agent_id ?? null,
      agent_name: input.agent_name ?? null,
    })
    .select('id, role, content, agent_id, agent_name, created_at')
    .single();

  if (error) throw error;
  return data as Message;
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
