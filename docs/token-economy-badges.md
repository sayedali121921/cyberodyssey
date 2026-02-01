# Cyberodessy - Token Economy & Badge Definitions

## Token Economy

### Overview
Tokens are a non-monetary reward system that incentivizes quality contributions. They can be earned through various platform actions and spent on platform perks.

**Philosophy:** Tokens reward effort and helpfulness, not just volume. Quality contributions earn more than quantity.

---

## Token Earning Rules

| Action | Tokens Earned | Trigger | API Action |
|--------|---------------|---------|------------|
| Create first project | +20 | First project created | `project_created_first` |
| Create subsequent project | +10 | Each new project | `project_created` |
| Publish first failure log | +25 | First failure log published | `failure_log_first` |
| Publish subsequent failure log | +15 | Each new failure log | `failure_log_created` |
| Comment marked helpful (by owner) | +5 | Owner marks comment helpful | `comment_helpful` |
| Receive mentor review | +10 | Mentor submits review on content | `mentor_review_received` |
| Complete mentor review (as mentor) | +20 | Submit a mentor review | `mentor_review_given` |
| Daily login (streak) | +2 | Login after 24h cooldown | `daily_streak` |
| 7-day streak bonus | +15 | 7 consecutive days | `streak_7` |
| 30-day streak bonus | +50 | 30 consecutive days | `streak_30` |
| Add iteration to project | +5 | New iteration created | `iteration_added` |

---

## Token Spending Rules

| Perk | Token Cost | Effect | Cooldown |
|------|------------|--------|----------|
| Request mentor quick review | 30 | Highlight content for mentor attention | 1 per week per project |
| Spotlight project for 24h | 50 | Featured on home page | 1 per month |
| Unlock premium resource | 20 | Access to gated curated resource | Per resource |
| Badge highlight on profile | 10 | Animate a badge on profile for 7 days | Per badge |

---

## Token Transaction Logging

Every token change is logged in `token_transactions` table:

```sql
INSERT INTO token_transactions (user_id, amount, action, reference_type, reference_id)
VALUES (
  'user-uuid',
  15,
  'failure_log_created',
  'failure_log',
  'failure-log-uuid'
);
```

---

## Badge Definitions

### Milestone Badges

| Code | Name | Description | Trigger Condition |
|------|------|-------------|-------------------|
| `first_project` | First Project | Created your first project on the platform | `projects.count >= 1` where user_id matches |
| `first_failure` | First Failure Logged | Documented your first failure — the beginning of growth! | `failure_logs.count >= 1` where user_id matches |
| `iteration_master` | Iteration Master | Completed 5 project iterations | `iterations.count >= 5` linked to user's projects |
| `resilient_learner` | Resilient Learner | Logged 10 failure logs with lessons learned | `failure_logs.count >= 10` where lessons_learned is not null |
| `streak_30` | 30-Day Streak | Active on the platform for 30 consecutive days | Streak counter reaches 30 |
| `project_completed` | Project Finisher | Completed your first project | `projects.status = 'COMPLETED'` first occurrence |

### Community Badges

| Code | Name | Description | Trigger Condition |
|------|------|-------------|-------------------|
| `helpful_5` | 5 Helpful Comments | Received 5 helpful marks on your comments | `comments.helpful_count >= 5` total across user's comments |
| `helpful_25` | Community Helper | Received 25 helpful marks on your comments | `comments.helpful_count >= 25` total |
| `mentor_contributor` | Mentor Contributor | Completed 10 meaningful reviews as a mentor | `mentor_reviews.count >= 10` where mentor_id matches |
| `community_verified` | Community Verified | Verified through community trust (reviews + confirmations) | `mentor_verifications.reviews_count >= 5 AND student_confirmations >= 3` |

### Special Badges

| Code | Name | Description | Trigger Condition |
|------|------|-------------|-------------------|
| `early_adopter` | Early Adopter | Joined during the platform's first 3 months | `users.created_at < launch_date + 90 days` |
| `pioneer` | Pioneer | First 100 users on the platform | `users.id` in first 100 by created_at |
| `mentor_verified` | Verified Mentor | Platform-verified mentor status | `users.role IN ('mentor', 'senior_mentor')` |

---

## Badge Award Logic (Pseudo-code)

```typescript
// Example: Award badge after failure log creation
async function handleFailureLogCreated(userId: string, logId: string) {
  // Award tokens
  await awardTokens(userId, 15, 'failure_log_created', 'failure_log', logId);
  
  // Check for first failure badge
  const logCount = await getFailureLogCount(userId);
  if (logCount === 1) {
    await awardBadge(userId, 'first_failure');
  }
  
  // Check for resilient learner badge
  if (logCount >= 10) {
    await awardBadge(userId, 'resilient_learner');
  }
}

// Example: Award badge after comment marked helpful
async function handleCommentMarkedHelpful(commentId: string) {
  const comment = await getComment(commentId);
  const totalHelpful = await getTotalHelpfulMarks(comment.user_id);
  
  // Award tokens
  await awardTokens(comment.user_id, 5, 'comment_helpful', 'comment', commentId);
  
  // Check badges
  if (totalHelpful >= 5) {
    await awardBadge(comment.user_id, 'helpful_5');
  }
  if (totalHelpful >= 25) {
    await awardBadge(comment.user_id, 'helpful_25');
  }
}
```

---

## Event-to-Action Mapping

| Event | Token Action | Badge Check |
|-------|--------------|-------------|
| User signs up | - | `early_adopter`, `pioneer` |
| Project created | `project_created` (+10/+20) | `first_project` |
| Project marked COMPLETED | - | `project_completed` |
| Failure log published | `failure_log_created` (+15/+25) | `first_failure`, `resilient_learner` |
| Iteration added | `iteration_added` (+5) | `iteration_master` |
| Comment posted | - | - |
| Comment marked helpful | `comment_helpful` (+5) | `helpful_5`, `helpful_25` |
| Mentor review submitted | `mentor_review_given` (+20) | `mentor_contributor` |
| Mentor review received | `mentor_review_received` (+10) | - |
| Mentor review confirmed | - | `community_verified` |
| Daily login (after 24h) | `daily_streak` (+2) | `streak_30` |
| 7-day streak reached | `streak_7` (+15) | - |
| 30-day streak reached | `streak_30` (+50) | `streak_30` |
| Mentor application approved | - | `mentor_verified` |

---

## Implementation Notes

### Badge Awarding Service
```typescript
async function awardBadge(userId: string, badgeCode: string): Promise<void> {
  const badge = await getBadgeByCode(badgeCode);
  if (!badge) return;
  
  // Check if already awarded
  const existing = await getUserBadge(userId, badge.id);
  if (existing) return;
  
  // Award badge
  await insertUserBadge(userId, badge.id);
  
  // Notify user (optional)
  await createNotification(userId, 'badge_earned', { badge });
}
```

### Token Balance Management
```typescript
async function awardTokens(
  userId: string,
  amount: number,
  action: string,
  referenceType?: string,
  referenceId?: string
): Promise<void> {
  // Log transaction
  await insertTokenTransaction(userId, amount, action, referenceType, referenceId);
  
  // Update balance
  await updateTokenBalance(userId, {
    balance: increment(amount),
    total_earned: increment(amount),
    last_updated: now()
  });
}

async function spendTokens(
  userId: string,
  amount: number,
  action: string,
  referenceType?: string,
  referenceId?: string
): Promise<boolean> {
  const tokens = await getTokenBalance(userId);
  if (tokens.balance < amount) return false;
  
  // Log transaction (negative amount)
  await insertTokenTransaction(userId, -amount, action, referenceType, referenceId);
  
  // Update balance
  await updateTokenBalance(userId, {
    balance: decrement(amount),
    total_spent: increment(amount),
    last_updated: now()
  });
  
  return true;
}
```

---

## Anti-Gaming Measures

1. **Rate limits:** Max 3 failure logs per day, max 10 comments per hour
2. **Quality thresholds:** Failure logs must have minimum character counts for key fields
3. **Duplicate detection:** Prevent copy-paste of identical content
4. **Cooldowns:** Token-earning actions have cooldown periods
5. **No self-helpful:** Users cannot mark their own comments as helpful
6. **Review verification:** Student must confirm mentor review was actually helpful for mentor to get community verification credit
