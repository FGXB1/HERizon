export type RoadmapStep = {
  title: string;
  description: string;
  href?: string;
};

export type IndustryRoadmap = {
  tool: RoadmapStep;
  microProject: RoadmapStep;
  community: RoadmapStep;
};

const GENERIC_ROADMAP: IndustryRoadmap = {
  tool: {
    title: "Pick one beginner tool",
    description: "Choose a free tool and explore it for 15 minutes. Tiny reps build confidence fast.",
  },
  microProject: {
    title: "Do one micro-project",
    description: "Make something small you can finish today. Keep it simple, then iterate tomorrow.",
  },
  community: {
    title: "Find one friendly community",
    description: "Look for a club, Discord, or local program where beginners are welcome and questions are normal.",
  },
};

export const ROADMAPS: Record<string, IndustryRoadmap> = {
  "music-production": {
    tool: {
      title: "Try a beginner DAW",
      description: "Use GarageBand (Mac/iOS) or BandLab (web) and learn: play, loop, and tempo.",
    },
    microProject: {
      title: "Recreate a 4-bar groove",
      description:
        "Make a 4-bar beat: Kick on 1/5/9/13, Snare on 5/13, Hats on 3/7/11/15. Then add one effect.",
    },
    community: {
      title: "Follow women producers",
      description:
        "Find 3 women producers/engineers and watch one short breakdown of how they build a track.",
    },
  },
  "automotive-engineering": {
    tool: {
      title: "Learn the 3 core signals",
      description:
        "Speed, grip, reliability. Practice reading simple telemetry: tire wear, fuel, engine health.",
    },
    microProject: {
      title: "Build a tiny strategy model",
      description:
        "In a notes app or spreadsheet, model lap time vs tire wear. Decide when you would pit and why.",
    },
    community: {
      title: "Find a women-in-engineering group",
      description:
        "Look for a local STEM club or a chapter of Society of Women Engineers (SWE) for events and mentorship.",
    },
  },
  "investment-banking": {
    tool: {
      title: "Learn deal vocabulary",
      description:
        "Pick 5 terms (valuation, dilution, debt, equity, EBITDA) and write your own one-sentence definitions.",
    },
    microProject: {
      title: "Make a one-page deal summary",
      description:
        "Create a simple 'deal sheet': company, goal, risks, and a recommendation (debt vs equity) with reasons.",
    },
    community: {
      title: "Explore women-focused finance programs",
      description:
        "Search for beginner programs like Girls Who Invest, or a school club focused on business and investing.",
    },
  },
};

export function getRoadmap(slug: string): IndustryRoadmap {
  return ROADMAPS[slug] ?? GENERIC_ROADMAP;
}

