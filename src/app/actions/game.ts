'use server'

import { createClient } from '@/lib/supabase/server'

export async function createRoomAction() {
  const supabase = await createClient()

  // Create a new room record to get an incremental ID
  const { data, error } = await supabase.from('rooms').insert({}).select('id').single()

  if (error) {
    console.error('Error creating room:', error)
    throw new Error('Could not create room')
  }

  return { roomId: data.id.toString() }
}
