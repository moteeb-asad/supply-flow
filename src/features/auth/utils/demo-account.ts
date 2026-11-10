// The shared demo account handed out with job applications. Changing its
// password or sending invites is turned off so it keeps working for every
// visitor (docs/decisions/0006).
export const DEMO_ACCOUNT_EMAIL = "demo@supplyflow.com";

export const DEMO_ACCOUNT_DISABLED_MESSAGE =
  "This is a shared demo account, so this action is turned off.";

export function isDemoAccount(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === DEMO_ACCOUNT_EMAIL;
}
