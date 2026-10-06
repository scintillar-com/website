import "server-only";

/** Refresh GitHub data once a day; pages are regenerated in the background (ISR). */
const REVALIDATE = 60 * 60 * 24;

export interface ActivityWeek {
  /** Unix seconds for the Sunday that starts the week. */
  week: number;
  /** Commit counts, Sunday to Saturday. */
  days: number[];
}

export interface Contributor {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

/** "https://github.com/owner/repo" -> "owner/repo". */
export function repoFromUrl(url: string) {
  return new URL(url).pathname.replace(/^\/|\/$/g, "");
}

function headers(): HeadersInit {
  // Optional: a token raises the API limit from 60 to 5,000 requests an hour.
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Daily commit counts for the last 52 weeks. GitHub computes these lazily and answers
 * 202 while it does, so retry a few times before giving up.
 */
export async function getCommitActivity(repo: string): Promise<ActivityWeek[] | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      // A distinct URL per attempt keeps a cached 202 from shadowing the retry.
      const res = await fetch(`https://api.github.com/repos/${repo}/stats/commit_activity?attempt=${attempt}`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      });
      if (res.status === 202) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      if (!res.ok) return null;
      const data = (await res.json()) as { week: number; days: number[] }[];
      return Array.isArray(data) ? data.map(({ week, days }) => ({ week, days })) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/** Human contributors, most commits first. */
export async function getContributors(repo: string, limit = 24): Promise<Contributor[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100`, {
      headers: headers(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { login: string; avatar_url: string; html_url: string; contributions: number; type: string }[];
    return data
      .filter((c) => c.type === "User" && !c.login.endsWith("[bot]"))
      .slice(0, limit)
      .map((c) => ({ login: c.login, avatarUrl: c.avatar_url, profileUrl: c.html_url, contributions: c.contributions }));
  } catch {
    return null;
  }
}
