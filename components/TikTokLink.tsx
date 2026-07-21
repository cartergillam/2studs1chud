export const TIKTOK_URL = "https://www.tiktok.com/@twostudsonechud";

export function TikTokLink() {
  return (
    <a
      className="tiktok-link"
      href={TIKTOK_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.2 3c.4 2.4 1.8 3.8 4.1 4.1v3.1c-1.5 0-2.9-.5-4.1-1.3v6.2a6 6 0 1 1-5.2-6v3.2a2.8 2.8 0 1 0 2 2.8V3h3.2Z" />
      </svg>
      <span>FOLLOW THE CHUDS ON TIKTOK</span>
    </a>
  );
}
