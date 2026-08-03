import { apiUrl } from './api';
import { WHATSAPP_NUMBER } from './links';

export const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT || '').trim()
  || apiUrl('/api/lead-capture');
export { WHATSAPP_NUMBER };
export const PRIVACY_POLICY_URL = (import.meta.env.VITE_PRIVACY_POLICY_URL || '').trim()
  || '/privacidad';
export const THANK_YOU_PAGE_URL = (import.meta.env.VITE_THANK_YOU_PAGE_URL || '').trim();

// EMAIL_PLATFORM_API es deliberadamente una variable exclusiva del backend.
export const FREE_RESOURCE_URL = '/recursos/checklist-levotiroxina.html';
