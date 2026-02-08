export interface NegotiationLine {
  speaker: "client" | "guide" | "narrator"
  text: string
}

export interface NegotiationChoice {
  label: string
  isCorrect: boolean
  /** Feedback the guide gives after this choice */
  guideFeedback: string
}

export interface NegotiationStep {
  /** Dialogue lines shown before the player chooses */
  dialogue: NegotiationLine[]
  /** Player response options */
  choices: NegotiationChoice[]
}

export interface NegotiationScenario {
  id: string
  title: string
  /** Brief setup shown at the start */
  introduction: NegotiationLine[]
  steps: NegotiationStep[]
  /** Shown if the user passes (got all correct) */
  successOutro: NegotiationLine[]
  /** Shown if the user fails (got any wrong) */
  failureOutro: NegotiationLine[]
}

// ========================================
// Guide character definition
// ========================================
export const GUIDE_NAME = "Victoria Chen"
export const GUIDE_TITLE = "Senior VP, M&A Advisory"
export const GUIDE_BIO = "20-year Wall Street veteran who has closed over $50B in deals. She is your mentor for this simulation."

// ========================================
// 3 NEGOTIATION SCENARIOS
// ========================================

export const negotiationScenarios: NegotiationScenario[] = [
  // ---- SCENARIO 1: Price Negotiation with Apex Technologies ----
  {
    id: "apex-price",
    title: "The Apex Price Negotiation",
    introduction: [
      { speaker: "narrator", text: "Final negotiation meeting. Apex Technologies' CFO, Daniel Park, is across the table. He wants to close at a lower price. Your job: defend NovaTech's $5.5B valuation and close the deal." },
      { speaker: "guide", text: "Remember, Daniel will try to anchor low. Don't concede on price without getting something in return. Stay confident and use data to back every point." },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "Look, $5.5 billion is a stretch for us. Our board is comfortable at $4.8 billion. NovaTech is a great company, but the SaaS market is cooling and we see risks in your customer concentration." },
        ],
        choices: [
          {
            label: "I understand your concern. Let's meet in the middle at $5.15 billion.",
            isCorrect: false,
            guideFeedback: "Never split the difference this early. You just dropped $350M without getting anything in return. In negotiation, the first person to concede on price loses leverage. You should have countered his concerns with data first.",
          },
          {
            label: "Our DCF analysis, comparable multiples, and precedent transactions all support $5.5B. NovaTech's 40% revenue growth and 120% net retention are well above market. What specific risk justifies a $700M discount?",
            isCorrect: true,
            guideFeedback: "Excellent. You challenged his position with data and put the burden of proof back on him. Making the buyer justify their discount is a powerful technique.",
          },
          {
            label: "That's way too low. We have other buyers willing to pay more. Take it or leave it.",
            isCorrect: false,
            guideFeedback: "Being aggressive without substance is a fast way to blow up a deal. Even if you have other buyers, threatening to walk away this early in the conversation signals desperation, not strength. Let the data do the talking.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Fair point on the growth numbers. But 30% of revenue from two clients is a real concern. If either churns post-acquisition, we're looking at a significant revenue hit." },
        ],
        choices: [
          {
            label: "You're right, that is a risk. Maybe we should lower the price to account for it.",
            isCorrect: false,
            guideFeedback: "Never validate a buyer's concern by immediately offering a price reduction. You had a prepared mitigation narrative — a pipeline of 15 new contracts and a diversification strategy. You should have used it.",
          },
          {
            label: "We've already addressed this. NovaTech has 15 new enterprise contracts in the pipeline, and their diversification strategy is projected to reduce top-client concentration to 18% within 18 months. We can build this into a performance milestone.",
            isCorrect: true,
            guideFeedback: "Strong answer. You acknowledged the concern, provided concrete data to mitigate it, and offered a creative structure (performance milestone) that protects both sides. This builds trust while protecting value.",
          },
          {
            label: "Every SaaS company has customer concentration. That's just how the industry works.",
            isCorrect: false,
            guideFeedback: "Dismissing a legitimate concern makes the buyer feel unheard and erodes trust. Even if concentration is common in SaaS, you need to show why NovaTech's specific situation is manageable, not wave it off.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Alright, the pipeline data is helpful. But we still can't go above $5.2 billion. That's our final offer." },
        ],
        choices: [
          {
            label: "We appreciate your position. At $5.2B, we'd need the deal to be all-cash with no closing conditions beyond regulatory approval, and an accelerated 30-day close. Certainty of value and speed have real economic worth.",
            isCorrect: true,
            guideFeedback: "Brilliant negotiation. Instead of just fighting on price, you traded price concession for deal certainty — all-cash, clean close, fast timeline. Priya's shareholders get guaranteed value. You turned a price gap into a win-win structure.",
          },
          {
            label: "Fine, $5.2 billion works. Let's close this.",
            isCorrect: false,
            guideFeedback: "You just left hundreds of millions on the table. Even when accepting a lower price, you should negotiate for better terms — cash vs. stock, closing speed, fewer conditions, retention packages. Price is only one dimension of a deal.",
          },
          {
            label: "No deal. Meridian offered $5.7 billion and we're going with them.",
            isCorrect: false,
            guideFeedback: "Walking away from a serious buyer without counter-offering is poor form. Meridian's $5.7B includes risky stock with a lockup period — the real value might be lower than Apex's cash offer. A good banker explores all angles before walking.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "Daniel nods. 'All-cash, 30-day close, regulatory only. We can do that.' The deal closes at $5.2B all-cash — the certainty premium makes this equivalent to roughly $5.5B in a mixed deal." },
      { speaker: "guide", text: "Outstanding work. You held your ground with data, addressed concerns without giving up value, and creatively structured a deal that works for both sides. That's how deals get done on Wall Street." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "The negotiation falls apart. Daniel leaves the table unconvinced, and Priya is disappointed with how the deal was handled." },
      { speaker: "guide", text: "This didn't go well. In M&A negotiation, every word matters. You need to back your position with data, never concede without getting something in return, and keep the relationship professional. Let's try another scenario." },
    ],
  },

  // ---- SCENARIO 2: Navigating the Board Meeting ----
  {
    id: "board-meeting",
    title: "The Board Room Showdown",
    introduction: [
      { speaker: "narrator", text: "Priya's board of directors has called an emergency session. Two board members are skeptical about selling NovaTech. You need to convince the board that this deal is in the best interest of all shareholders." },
      { speaker: "guide", text: "Board members think like fiduciaries. They care about shareholder value, timing risk, and their personal liability. Frame everything through the lens of 'what's best for shareholders.'" },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "I'm Raj Mehta, lead independent director. I've seen too many tech acquisitions destroy value. Why should we sell now when NovaTech could be worth $10B in three years as a public company?" },
        ],
        choices: [
          {
            label: "That $10B projection assumes perfect execution, no market downturns, and continued 40% growth. Our analysis shows a 60% probability-weighted value of $4.2B if NovaTech stays independent, versus a guaranteed $5.5B today. A bird in the hand is worth two in the bush.",
            isCorrect: true,
            guideFeedback: "Perfect framing. You acknowledged the upside but grounded it in probability. Board members have fiduciary duty — showing them the risk-adjusted comparison makes the sale decision defensible. The proverb at the end makes it memorable.",
          },
          {
            label: "NovaTech has already peaked. The market is turning and you should sell while you still can.",
            isCorrect: false,
            guideFeedback: "You just insulted the company that everyone in this room built. Saying they've 'peaked' will immediately make the board defensive and hostile. Never disparage the target — instead, show why the current offer captures maximum value.",
          },
          {
            label: "Trust me, I've done a lot of deals. This is the right time to sell.",
            isCorrect: false,
            guideFeedback: "'Trust me' is not an argument. Board members are sophisticated professionals who need data, not appeals to authority. They're personally liable for this decision and need quantitative justification they can stand behind.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Even if the numbers make sense, I'm worried about our employees. Priya promised them we'd protect the team. What guarantees do we have that Apex won't slash headcount six months after closing?" },
        ],
        choices: [
          {
            label: "Employee matters aren't really a board-level concern. The shareholders come first, and this price is excellent for them.",
            isCorrect: false,
            guideFeedback: "Employee retention IS a board-level concern, especially when the CEO made it a priority. Dismissing it shows you don't understand your client's values. It also ignores the reality that talent is NovaTech's core asset — losing engineers destroys the value Apex is paying for.",
          },
          {
            label: "We've negotiated 2-year retention packages for the top 50 engineers with guaranteed bonuses and accelerated vesting. Apex has committed to maintaining the engineering office for at least 3 years. These terms are legally binding in the purchase agreement.",
            isCorrect: true,
            guideFeedback: "This is exactly what the board needs to hear — specific, concrete protections that are legally enforceable. You showed that employee concerns were taken seriously and addressed with real commitments, not just promises.",
          },
          {
            label: "Apex has a great track record with acquisitions. I'm sure they'll treat everyone well.",
            isCorrect: false,
            guideFeedback: "Your earlier research showed Apex actually struggled with talent retention in past acquisitions. The board likely knows this too. Vague reassurances without specific contractual protections will undermine your credibility.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "One last question. Goldman Sachs is advising the buyer. How do we know JPMorgan isn't just pushing this deal through to collect the advisory fee?" },
        ],
        choices: [
          {
            label: "Our fee is standard at 0.5% of deal value, and it's disclosed in our engagement letter. We ran a competitive process with 5 initial buyers narrowed to 2 finalists. The process is documented and defensible. We'd recommend rejecting any offer below our valuation floor.",
            isCorrect: true,
            guideFeedback: "Transparency wins trust. You addressed the conflict-of-interest concern head-on by disclosing the fee, documenting the process, and showing willingness to walk away. This protects the board from liability and builds confidence in your advice.",
          },
          {
            label: "That's offensive. JPMorgan has the highest reputation on Wall Street. We would never compromise our integrity.",
            isCorrect: false,
            guideFeedback: "Getting defensive about a legitimate governance question is a red flag to board members. Conflicts of interest are a real concern in M&A advisory. The professional response is transparency about fees, process documentation, and your willingness to recommend against a bad deal.",
          },
          {
            label: "Our interests are aligned — the higher the price, the higher our fee. So we're naturally motivated to get you the best deal.",
            isCorrect: false,
            guideFeedback: "This actually highlights the conflict rather than addressing it. A 0.5% fee means you earn an extra $1.5M on a $300M price increase — not enough to truly align interests. The board will see through this logic. Better to show process integrity.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "The board votes unanimously to approve the sale. Raj Mehta shakes your hand: 'Well presented. You've earned JPMorgan's reputation today.'" },
      { speaker: "guide", text: "You handled a skeptical board with data, transparency, and respect. Board presentations are where deals are won or lost — today you won." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "The board votes to delay the sale pending further review. The deal timeline slips, and Apex begins looking at other targets. The window of opportunity is closing." },
      { speaker: "guide", text: "Board members need data-driven arguments and transparency. Emotional appeals, vague reassurances, and defensiveness don't work with experienced directors. The deal is at risk now." },
    ],
  },

  // ---- SCENARIO 3: Handling the Hostile Counter-Bid ----
  {
    id: "hostile-counter",
    title: "The Hostile Counter-Bid",
    introduction: [
      { speaker: "narrator", text: "48 hours before signing, Meridian Partners crashes the deal with an unsolicited $6.1B offer — 10% above Apex's bid. Priya is conflicted. The board wants answers. You need to analyze this fast and advise correctly." },
      { speaker: "guide", text: "A last-minute competing bid is high-pressure. The instinct is to jump at the higher number, but the details matter enormously. Evaluate structure, certainty, and hidden risks before advising." },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "Victoria, Meridian is offering $6.1 billion. That's $600 million more than Apex. My shareholders will sue me if I don't take the higher offer. How can you possibly recommend I turn down $600 million?" },
        ],
        choices: [
          {
            label: "Let's break down the offer structure first. Meridian is offering 40% in stock with a 6-month lockup. Their stock has a beta of 1.8 and has dropped 25% in the last quarter. The effective value at risk-adjusted terms could be $5.3B — actually less than Apex's all-cash bid.",
            isCorrect: true,
            guideFeedback: "Exactly right. The headline number is misleading. You quantified the stock risk clearly — the lockup period, volatility, and recent decline all reduce the real value. Your shareholders can't spend a stock price that might not be there in 6 months.",
          },
          {
            label: "You're right, $6.1B is much better. We should switch to Meridian immediately.",
            isCorrect: false,
            guideFeedback: "Jumping at the headline number without analyzing deal structure is the most dangerous mistake in M&A. The stock component, lockup period, and regulatory risk could easily eat the $600M premium. A good advisor looks beyond the top-line price.",
          },
          {
            label: "I think we should just ignore Meridian. We've been working with Apex for months and it would be rude to switch now.",
            isCorrect: false,
            guideFeedback: "Your fiduciary duty is to shareholders, not to maintaining polite relationships. You're legally obligated to consider any superior proposal. The right approach is to evaluate it rigorously, not dismiss it or accept it blindly.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "The board is still nervous about the headline number difference. Raj says that if this goes to court, a judge will ask why we turned down $6.1 billion for $5.5 billion. How do we protect ourselves legally?" },
        ],
        choices: [
          {
            label: "We'll prepare a detailed analysis comparing both bids on an apples-to-apples basis: certainty of closing, regulatory risk, stock volatility analysis, financing conditions, and timeline. We'll get a fairness opinion from an independent advisor documenting that the Apex deal delivers superior risk-adjusted value.",
            isCorrect: true,
            guideFeedback: "This is exactly how you protect a board legally. A fairness opinion from an independent party, combined with a documented analytical framework comparing the bids, creates a defensible record. The board can show they exercised proper judgment.",
          },
          {
            label: "Don't worry about lawsuits. Shareholders won't actually sue over a few hundred million.",
            isCorrect: false,
            guideFeedback: "Shareholder lawsuits are extremely common in M&A. Turning down a nominally higher bid is one of the top triggers. The board needs documented protection — a fairness opinion and rigorous comparative analysis — not your personal reassurance.",
          },
          {
            label: "Let's just accept both offers and see which one actually closes.",
            isCorrect: false,
            guideFeedback: "You can't accept two acquisition offers simultaneously. That would be a breach of fiduciary duty and contractual obligations. Exclusive dealing is typically required once you sign a definitive agreement. This would create legal chaos.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Okay, the analysis is compelling. But can we use Meridian's bid to squeeze more from Apex? I want to get the absolute best outcome for my shareholders." },
        ],
        choices: [
          {
            label: "Absolutely. We'll go back to Apex with a 'last look' — informing them of a competing superior proposal and giving them 48 hours to improve their terms. We should ask for an increase to $5.65B all-cash with the same clean closing conditions. This uses competitive tension without blowing up the Apex deal.",
            isCorrect: true,
            guideFeedback: "Perfect execution. The 'last look' or 'go-shop' mechanism is a standard M&A tool. You leveraged the competing bid to extract more value from the preferred buyer while maintaining the deal structure you want. This is how senior bankers maximize shareholder value.",
          },
          {
            label: "Let's start a full auction process between the two bidders and drag it out to get the highest price.",
            isCorrect: false,
            guideFeedback: "A full re-auction 48 hours before signing would signal chaos and desperation. Apex might walk away entirely. Meridian might lower their bid. Deal fatigue is real — the longer you drag out a process, the more likely both buyers reconsider. A targeted 'last look' is far more effective.",
          },
          {
            label: "No, let's not get greedy. We have a good deal with Apex. Let's just sign and move on.",
            isCorrect: false,
            guideFeedback: "You have a fiduciary duty to maximize shareholder value. When a competing bid creates genuine leverage, not using it is actually a failure of your advisory obligation. You don't need to be 'greedy' — you need to be thorough and professional.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "Apex comes back with $5.65B all-cash, 45-day close, regulatory only. The board unanimously approves. Priya signs the definitive agreement. $5.65 billion in guaranteed cash — the best possible outcome." },
      { speaker: "guide", text: "Masterfully handled. You turned a chaotic last-minute bid into leverage, protected the board legally, and delivered an extra $150M for shareholders. This is the kind of work that builds careers on Wall Street." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "The deal collapses amid confusion. Apex walks away offended, Meridian withdraws their offer citing 'process concerns,' and NovaTech is left without a buyer. Priya's board is furious." },
      { speaker: "guide", text: "When a last-minute bid arrives, you need to stay calm and analytical. Jumping at headlines, dismissing concerns, or creating chaos can destroy a deal that took months to build. Let's try another scenario." },
    ],
  },
]
