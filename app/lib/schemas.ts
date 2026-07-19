import { z } from "zod";

// Codeforces API Schemas
export const CodeforcesUserInfoSchema = z.object({
  status: z.string(),
  result: z.array(
    z.object({
      handle: z.string().optional(),
      rating: z.number().optional(),
      maxRating: z.number().optional(),
      rank: z.string().optional(),
      maxRank: z.string().optional(),
      avatar: z.string().optional(),
    })
  ).optional(),
});

export const CodeforcesStatusSchema = z.object({
  status: z.string(),
  result: z.array(
    z.object({
      verdict: z.string().optional(),
      creationTimeSeconds: z.number().optional(),
      problem: z.object({
        contestId: z.number().optional(),
        index: z.string().optional(),
      }).optional(),
    })
  ).optional(),
});

export const CodeforcesRatingSchema = z.object({
  status: z.string(),
  result: z.array(z.any()).optional(),
});

// LeetCode API Schemas
export const LeetCodeResponseSchema = z.object({
  data: z.object({
    allQuestionsCount: z.array(
      z.object({
        difficulty: z.string(),
        count: z.number(),
      })
    ).optional(),
    matchedUser: z.object({
      submitStats: z.object({
        acSubmissionNum: z.array(
          z.object({
            difficulty: z.string(),
            count: z.number(),
          })
        ).optional(),
      }).optional(),
      calendarCurrent: z.object({
        submissionCalendar: z.string().optional(),
      }).optional().nullable(),
      calendarPrev: z.object({
        submissionCalendar: z.string().optional(),
      }).optional().nullable(),
    }).optional().nullable(),
    userContestRanking: z.object({
      rating: z.number().optional(),
      topPercentage: z.number().optional(),
    }).optional().nullable(),
  }).optional(),
});

// GitHub Contributions & User REST API Schemas
export const GithubContributionsSchema = z.object({
  total: z.record(z.string(), z.number()).optional(),
  contributions: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
      level: z.number(),
    })
  ).optional(),
});

export const GithubUserSchema = z.object({
  public_repos: z.number().optional(),
});

export const GithubRepoSchema = z.object({
  name: z.string(),
  stargazers_count: z.number().default(0),
  language: z.string().nullable().optional(),
  fork: z.boolean().default(false),
});

export const GithubReposArraySchema = z.array(GithubRepoSchema);

export const GithubEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  created_at: z.string(),
  repo: z.object({
    name: z.string(),
  }),
  payload: z.object({
    commits: z.array(
      z.object({
        sha: z.string().optional(),
        message: z.string().optional(),
        url: z.string().optional(),
      })
    ).optional(),
  }).optional(),
});

export const GithubEventsArraySchema = z.array(GithubEventSchema);


export type NormalizedCodeforcesDto = {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  solvedCount: number;
  contestCount: number;
  avatar: string;
  calendar: Record<string, number>;
};
