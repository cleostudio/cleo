/**
 * Shared Better Auth `user.additionalFields` definitions.
 * Keep server (`lib/auth.ts`) and client (`lib/auth-client.ts`) in sync.
 */
export const userAdditionalFields = {
  /**
   * Dock Preferences → Location. Opt-in; off by default.
   * Browser geolocation grant remains separate from this preference.
   */
  locationSyncEnabled: {
    type: 'boolean' as const,
    required: false,
    defaultValue: false,
    input: true,
  },
}
