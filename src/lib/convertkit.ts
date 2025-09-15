const API_BASE = 'https://api.convertkit.com/v3';
const FORM_ID = import.meta.env.VITE_CONVERTKIT_FORM_ID;
const API_KEY = import.meta.env.VITE_CONVERTKIT_API_KEY;

export interface SubscribeResponse {
  subscription?: {
    id: number;
    state: string;
    email_address: string;
  };
}

export async function subscribeToForm(email: string): Promise<SubscribeResponse> {
  const url = `${API_BASE}/forms/${FORM_ID}/subscribe`;
  const body = new URLSearchParams({
    email: email.trim(),
    api_key: API_KEY || '',
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: Failed to subscribe`);
  }

  return response.json();
}
