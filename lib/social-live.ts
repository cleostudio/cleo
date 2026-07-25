import type { GitHubSnapshot, SocialSnapshot } from '~/components/social-cards'
import bakedGithub from '~/content/github.json'
import bakedSocial from '~/content/social.json'

export interface SocialData {
  x: SocialSnapshot
  telegram: SocialSnapshot
  youtube: SocialSnapshot
}

// Baked snapshots only — no live third-party fetches. Edit content/*.json
// when numbers change.

export async function getGitHub(): Promise<GitHubSnapshot> {
  return bakedGithub as GitHubSnapshot
}

export async function getSocial(): Promise<SocialData> {
  return bakedSocial as SocialData
}
