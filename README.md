  # illuminate-her

# Summary: 

For the hackathon we are planning on creating an app that exposes women to male-dominated fields and helps them explore opportunities and interests that they might have in industries that seemed daunting because of how the society (patriarchy) has framed it over time. 

# Idea: 

The idea is to target a few specific industries in this hackathon and then show how this could be expanded into 100s of different fields in the future. We want to create a gamification/interactive experience and target it towards middle school or high school girls to spark the interest at a age where you can act on it. So, we are planning on targeting three different industries: music production, automotive industry, and investment banking.  

The plan is to create a demo or interactive experience for each of them and through each demo you target different perspective or paths or concepts in that one industry. For music production we wanted to do rhythms, instruments, and audio effects. For automotive industry we wanted to focus on tire traction, frame, and engine power/fuel (we were thinking of this in the f1 pit stop perspective just as an idea); we also want to focus on looking at capital management, speed, time, efficiency etc. For the investment banking part, we wanted to look at the capital/stocks side of thing, strategies of most profits, and negotiation/communication with clients. 

# Specs: 

I am listing out some tracks and awards at the hackathon that we would prefer to use and focus on so that we have the best chance of winning.  

# MLH: 

Best Use of Gemini API 

Best Use of Solana 

Best Use of AI powered by reach capital 

Best Use of Eleven Labs 

Best Use of Snowflake API 

Best Use of MongoDB Atlas 

# InnovateHer tracks: 

Mind Matters: This track encourages participants to create tech solutions that support emotional well-being, mental health awareness, and accessible support systems. Projects should prioritize inclusivity, reduce stigma, and offer low-barrier tools for selfcare, especially for students and underrepresented groups. 

Art and Culture: This track encourages participants to transform technology into a tool for artistic expression, blending code with music, fashion, design, and storytelling to craft meaningful, visually rich, and boundary-pushing experiences. (I think the best track for our idea, but it doesn’t really fit into it so tell me how to add ideas and features that makes it more specific to this track) 

Finance Forward: Create tech solutions that empower women to take control of their finances. From tackling wage gaps and career breaks to building confidence in investing and budgeting, projects should provide tools that are inclusive, accessible, and actionable. 

#Some features: 

Since these fields are predominantly men and people usually don’t know famous women in them, we can show the stories of these women, have them do talks, and just showcase their efforts. 

Add specific opportunities like programs, courses, jobs for women so that it is easier for them to get into a field where they might be judged to be the only woman there just cause that is how the industry is. 

# Conclusion: 

We are trying to help women see all the opportunities that are present out there at a younger more foundational, developmental age. We want to show them that mechanics and working with engines and hardware isn’t something that only men can do, to show them that women can and are pursuing careers like that. We want to not make this a course, khan academy type app. We want to just expose them to certain industries that they might like and then guide them into how they could form a career in that. We are trying to spark the interest. 
 

 

# Features (finalized): 

"Her Story" animated timelines —  

show illustrated stories of real women pioneers (Suzanne Ciani in music production, Simone Giertz or Danica Patrick in automotive, Sallie Krawcheck in finance).  

Use ElevenLabs to have AI-narrated audio bios in these women's "voices." 

Gemini API –  

We create a more immersive experience by using Gemini to interpret user interaction signals and estimate cognitive or emotional load, then adapt course content in real time.  

Rather than detecting emotions or diagnosing trauma, the system adjusts pacing, tone, and presentation style to reduce overload and avoid triggering patterns, optimizing for engagement and learning continuity under changing user conditions 

Eleven Labs (Best Use of Eleven Labs) —  

Use this for narration and immersion. Have AI voices narrate the stories of women pioneers in each industry.  

Add voice-guided instructions in each demo so users feel like they have a personal mentor talking them through it.  

For the music production module, you could even use ElevenLabs to demonstrate vocal effects and audio processing concepts. 

MongoDB Atlas (Best Use of MongoDB Atlas) —  

Use this as your database for storing user profiles, progress, quiz scores, leaderboard data, and the community gallery submissions 

Add a "Letter to My Future Self" at the end — after completing all demos, the user writes (or voice-records via Eleven Labs) a message to their future self about what they discovered. Store it in MongoDB and let them revisit it. This is a well-known therapeutic and self-care technique. 

# Each industry includes: 

Intro (what it is, what you do, quick explanation/facts/etc.) 

Interactive demo (2 to 4 minutes) 

3 to 5 women spotlights embedded in the flow of the demo 

Future Career Roadmap (organizations, education, certs, salary range) 

Essentially, we want this to be an exposure to the industry and gamify the experience. We want to get women's curiosity piqued and interest to spark rather than them being intimidated or reluctant to explore new fields. 

# Three industries: 

- Music Production 
  - Music Lab: “Make a beat that feels confident” 
  - Include very small intro to concept of rhythm, sfx 
  - Could be like tips in the corner 
  - Rhythm/Beats 
    - Step Sequencer Grid: 
    - 4 rows = Kick, Snare, Hi Hat, Clap 
    - 8 or 16 columns = time steps 
    - Tap square = activate sound 
  - Sound Effects - User can toggle: 
    - Reverb 
    - Echo 
    - Distortion (optional stretch goal) 
  - Instruments 
    - Synth 
    - Piano 
    - Bass line 
  - UI Components Needed 
    - Sequencer Grid Component 
    - Sound Selector Panel 
    -  Effects Toggle Panel 
    -  Tempo Slider 
    -  Play/Stop Button 
    -  Sound Wave Visualization 
    -  Tutorial Overlay System 
- Investment Banking: Walk Through Wall Street 
  - Core Gameplay Loop 
    - User moves across board (Monopoly style) 
    -  Lands on building or character 
    -  Completes micro interaction 
    -  Builds toward closing a deal 
  - User interacts with different characters and buildings to learn 
    - Investors teach 
      - Capital 
      - Risk tolerance 
      -  Return expectations 
      - Mini choice interaction. 
    - Companies 
      -  Valuation 
      -  Growth 
      -  Funding needs 
      -  Dialogue tree style interaction 
    - Buildings are the Trading Floor 
      - Stocks 
      - Market fluctuation 
      - Mini slider or prediction mechanic.  
    - Negotiation Room (Final Goal) - User assembles deal: 
      - Choose equity %  
      - Choose debt level 
      - Choose valuation range 
- UI Components Needed 
  -  Board Map View (like Crossy Road 3D) 
  -  Player Character Marker 
  -  Dialogue Popup System 
  -  Choice Card System 
  -  Deal Meter UI 
  -  Glossary Tooltip System 
- Automotive: F1-type of interactive demo 
  - Core Gameplay Loop: Goes through an F1 match 
    -  Race begins 
    -  Car runs laps 
    -  Pit stop decision appears 
    -  User selects upgrades or fixes 
    -  Race continues 
    -  Final result shown 
  - Pit Stop features 
    - Change/design the frame 
    - Tires to help with traction  
    - Fuel or fix up the engine  
  - Stats That Update Live 
    -  Speed 
    -  Control 
    -  Tire Wear 
    -  Engine Health 
    -  Lap Time Prediction 
  - UI Components Needed 
    -  Car visualization with interesting zoom-ins/depiction of parts 
    - Track Map Visualization 
    - Live Telemetry Dashboard 
    -  Pit Stop Decision Modal 
    -  Stat Bar Visualization 
    -  Race Progress Timeline 

# Features (potential): 

Design-your-own elements — in the automotive demo, let them pick colors/designs for their F1 car. In music, let them create album art. In finance, let them design their own "brand" for a mock company. This adds a layer of creative ownership. 

Snowflake API (Best Use of Snowflake) — Use this to store and query aggregated data: what industries are most popular among users, completion rates per module, common quiz answers. You can build a simple analytics dashboard showing trends like "78% of users discovered a new interest in automotive engineering." This demonstrates data-driven impact. 

Solana (Best Use of Solana) — Award blockchain-based achievement badges or "certificates" when users complete a module. Think of them as digital collectibles — "I completed the F1 Pit Stop Challenge" or "Music Producer Level 1." These are lightweight to implement and judges love seeing blockchain used in a novel, non-financial way. 

 

 
