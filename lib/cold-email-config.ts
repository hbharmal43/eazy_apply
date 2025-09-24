// website/lib/cold-email-config.ts
// Configuration and cost guards for cold email feature

export interface ColdEmailLimits {
  maxContactsPerSearch: number
  maxCreditsPerUser: number
  maxCreditsPerDay: number
  maxEmailsPerDay: number
  maxSubjectLength: number
  maxBodyLength: number
  rateLimitRequests: number
  rateLimitWindow: number // in seconds
}

export interface ColdEmailCosts {
  snovCreditCost: number // USD per credit
  openrouterCostPer1kTokens: number // USD per 1k tokens
  estimatedTokensPerEmail: number
}

// Default limits and costs
export const DEFAULT_LIMITS: ColdEmailLimits = {
  maxContactsPerSearch: 2,
  maxCreditsPerUser: 100, // per month
  maxCreditsPerDay: 10,
  maxEmailsPerDay: 20,
  maxSubjectLength: 60,
  maxBodyLength: 1400,
  rateLimitRequests: 5,
  rateLimitWindow: 60, // 1 minute
}

export const DEFAULT_COSTS: ColdEmailCosts = {
  snovCreditCost: 0.10, // $0.10 per credit
  openrouterCostPer1kTokens: 0.0005, // $0.0005 per 1k tokens for Llama 3.1 8B
  estimatedTokensPerEmail: 400, // ~400 tokens per email generation
}

export interface UserUsage {
  userId: string
  creditsUsedThisMonth: number
  creditsUsedToday: number
  emailsSentToday: number
  lastEmailSent: Date | null
  rateLimitAttempts: number
  rateLimitWindowStart: Date | null
}

export class ColdEmailGuard {
  private limits: ColdEmailLimits
  private costs: ColdEmailCosts
  private userUsage: Map<string, UserUsage> = new Map()

  constructor(limits: ColdEmailLimits = DEFAULT_LIMITS, costs: ColdEmailCosts = DEFAULT_COSTS) {
    this.limits = limits
    this.costs = costs
  }

  // Check if user can perform a cold email search
  canPerformSearch(userId: string, requestedCredits: number = 3): {
    allowed: boolean
    reason?: string
    suggestedAction?: string
  } {
    const usage = this.getUserUsage(userId)

    // Check rate limiting
    if (this.isRateLimited(usage)) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        suggestedAction: `Please wait ${this.limits.rateLimitWindow} seconds before trying again`
      }
    }

    // Check daily credit limit
    if (usage.creditsUsedToday + requestedCredits > this.limits.maxCreditsPerDay) {
      return {
        allowed: false,
        reason: 'Daily credit limit exceeded',
        suggestedAction: `Daily limit: ${this.limits.maxCreditsPerDay} credits. Try again tomorrow.`
      }
    }

    // Check monthly credit limit
    if (usage.creditsUsedThisMonth + requestedCredits > this.limits.maxCreditsPerUser) {
      return {
        allowed: false,
        reason: 'Monthly credit limit exceeded',
        suggestedAction: `Monthly limit: ${this.limits.maxCreditsPerUser} credits. Upgrade your plan for more.`
      }
    }

    // Check daily email limit
    if (usage.emailsSentToday >= this.limits.maxEmailsPerDay) {
      return {
        allowed: false,
        reason: 'Daily email limit exceeded',
        suggestedAction: `Daily limit: ${this.limits.maxEmailsPerDay} emails. Try again tomorrow.`
      }
    }

    return { allowed: true }
  }

  // Record a cold email attempt
  recordEmailAttempt(userId: string, creditsUsed: number): void {
    const usage = this.getUserUsage(userId)
    const now = new Date()

    // Reset daily counters if it's a new day
    if (this.isNewDay(usage.lastEmailSent, now)) {
      usage.creditsUsedToday = 0
      usage.emailsSentToday = 0
    }

    // Reset monthly counters if it's a new month
    if (this.isNewMonth(usage.lastEmailSent, now)) {
      usage.creditsUsedThisMonth = 0
    }

    // Update usage
    usage.creditsUsedToday += creditsUsed
    usage.creditsUsedThisMonth += creditsUsed
    usage.emailsSentToday += 1
    usage.lastEmailSent = now

    // Update rate limiting
    if (this.isNewRateLimitWindow(usage.rateLimitWindowStart, now)) {
      usage.rateLimitAttempts = 1
      usage.rateLimitWindowStart = now
    } else {
      usage.rateLimitAttempts += 1
    }

    this.userUsage.set(userId, usage)
  }

  // Calculate estimated cost for a cold email attempt
  calculateCost(creditsUsed: number, tokensUsed: number = DEFAULT_COSTS.estimatedTokensPerEmail): number {
    const snovCost = creditsUsed * this.costs.snovCreditCost
    const openrouterCost = (tokensUsed / 1000) * this.costs.openrouterCostPer1kTokens
    return snovCost + openrouterCost
  }

  // Get user's current usage stats
  getUserUsageStats(userId: string): UserUsage & {
    remainingCreditsToday: number
    remainingCreditsThisMonth: number
    remainingEmailsToday: number
    estimatedCostToday: number
    estimatedCostThisMonth: number
  } {
    const usage = this.getUserUsage(userId)
    
    return {
      ...usage,
      remainingCreditsToday: Math.max(0, this.limits.maxCreditsPerDay - usage.creditsUsedToday),
      remainingCreditsThisMonth: Math.max(0, this.limits.maxCreditsPerUser - usage.creditsUsedThisMonth),
      remainingEmailsToday: Math.max(0, this.limits.maxEmailsPerDay - usage.emailsSentToday),
      estimatedCostToday: this.calculateCost(usage.creditsUsedToday),
      estimatedCostThisMonth: this.calculateCost(usage.creditsUsedThisMonth),
    }
  }

  // Validate email content
  validateEmailContent(subject: string, body: string): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!subject.trim()) {
      errors.push('Subject is required')
    } else if (subject.length > this.limits.maxSubjectLength) {
      errors.push(`Subject too long (${subject.length}/${this.limits.maxSubjectLength} chars)`)
    }

    if (!body.trim()) {
      errors.push('Email body is required')
    } else if (body.length > this.limits.maxBodyLength) {
      errors.push(`Body too long (${body.length}/${this.limits.maxBodyLength} chars)`)
    }

    // Check for spam indicators
    const spamWords = ['urgent', 'free', 'guarantee', 'limited time', 'act now']
    const subjectLower = subject.toLowerCase()
    const bodyLower = body.toLowerCase()
    
    spamWords.forEach(word => {
      if (subjectLower.includes(word) || bodyLower.includes(word)) {
        errors.push(`Avoid spam words like "${word}" to improve deliverability`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private getUserUsage(userId: string): UserUsage {
    if (!this.userUsage.has(userId)) {
      this.userUsage.set(userId, {
        userId,
        creditsUsedThisMonth: 0,
        creditsUsedToday: 0,
        emailsSentToday: 0,
        lastEmailSent: null,
        rateLimitAttempts: 0,
        rateLimitWindowStart: null,
      })
    }
    return this.userUsage.get(userId)!
  }

  private isRateLimited(usage: UserUsage): boolean {
    if (!usage.rateLimitWindowStart) return false
    
    const now = new Date()
    const windowEnd = new Date(usage.rateLimitWindowStart.getTime() + this.limits.rateLimitWindow * 1000)
    
    if (now > windowEnd) {
      return false // Window expired
    }
    
    return usage.rateLimitAttempts >= this.limits.rateLimitRequests
  }

  private isNewDay(lastDate: Date | null, currentDate: Date): boolean {
    if (!lastDate) return true
    return lastDate.toDateString() !== currentDate.toDateString()
  }

  private isNewMonth(lastDate: Date | null, currentDate: Date): boolean {
    if (!lastDate) return true
    return lastDate.getMonth() !== currentDate.getMonth() || 
           lastDate.getFullYear() !== currentDate.getFullYear()
  }

  private isNewRateLimitWindow(windowStart: Date | null, currentDate: Date): boolean {
    if (!windowStart) return true
    return currentDate.getTime() - windowStart.getTime() > this.limits.rateLimitWindow * 1000
  }
}

// Singleton instance
export const coldEmailGuard = new ColdEmailGuard()

// Helper function to check if user can send cold email
export function checkColdEmailPermission(userId: string, requestedCredits: number = 3) {
  return coldEmailGuard.canPerformSearch(userId, requestedCredits)
}

// Helper function to record cold email usage
export function recordColdEmailUsage(userId: string, creditsUsed: number) {
  coldEmailGuard.recordEmailAttempt(userId, creditsUsed)
}

// Helper function to get user stats
export function getColdEmailUsageStats(userId: string) {
  return coldEmailGuard.getUserUsageStats(userId)
}

// Helper function to validate email
export function validateColdEmail(subject: string, body: string) {
  return coldEmailGuard.validateEmailContent(subject, body)
}
