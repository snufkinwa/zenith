interface UsageStats {
  codeExecutions: number
  apiCalls: number
  hintsUsed: number
  lastReset: string
}

interface UserLimits {
  tier: 'free' | 'pro' | 'premium'
  codeExecutions: number
  apiCalls: number
  hintsUsed: number
}

const TIER_LIMITS: Record<string, UserLimits> = {
  free: {
    tier: 'free',
    codeExecutions: 50,     // 50 code runs per day
    apiCalls: 100,          // 100 API calls per day
    hintsUsed: 10           // 10 AI hints per day
  },
  pro: {
    tier: 'pro',
    codeExecutions: 500,
    apiCalls: 1000,
    hintsUsed: 100
  },
  premium: {
    tier: 'premium',
    codeExecutions: -1,     // Unlimited
    apiCalls: -1,
    hintsUsed: -1
  }
}

export class UsageTracker {
  private userId: string
  private supabase: any

  constructor(userId: string, supabase: any) {
    this.userId = userId
    this.supabase = supabase
  }

  async getUsageStats(): Promise<UsageStats> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await this.supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', this.userId)
      .eq('date', today)
      .single()

    if (error || !data) {
      // Create new usage record for today
      const newUsage = {
        user_id: this.userId,
        date: today,
        code_executions: 0,
        api_calls: 0,
        hints_used: 0
      }
      
      await this.supabase.from('user_usage').insert(newUsage)
      return {
        codeExecutions: 0,
        apiCalls: 0,
        hintsUsed: 0,
        lastReset: today
      }
    }

    return {
      codeExecutions: data.code_executions,
      apiCalls: data.api_calls,
      hintsUsed: data.hints_used,
      lastReset: data.date
    }
  }

  async getUserTier(): Promise<UserLimits> {
    const { data } = await this.supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', this.userId)
      .single()

    const tier = data?.subscription_tier || 'free'
    return TIER_LIMITS[tier]
  }

  async canExecuteCode(): Promise<{ allowed: boolean; remaining: number }> {
    const [usage, limits] = await Promise.all([
      this.getUsageStats(),
      this.getUserTier()
    ])

    if (limits.codeExecutions === -1) {
      return { allowed: true, remaining: -1 }
    }

    const remaining = limits.codeExecutions - usage.codeExecutions
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining)
    }
  }

  async trackCodeExecution(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    
    await this.supabase.rpc('increment_usage', {
      p_user_id: this.userId,
      p_date: today,
      p_field: 'code_executions'
    })
  }

  async trackAPICall(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    
    await this.supabase.rpc('increment_usage', {
      p_user_id: this.userId,
      p_date: today,
      p_field: 'api_calls'
    })
  }

  async trackHintUsage(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    
    await this.supabase.rpc('increment_usage', {
      p_user_id: this.userId,
      p_date: today,
      p_field: 'hints_used'
    })
  }
}