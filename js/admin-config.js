export const EMAILS_ADMIN = [
  "kewyn.costa@escola.pr.gov.br" 
];

export function eAdmin(email) {
  return EMAILS_ADMIN.includes(email?.toLowerCase().trim());
}