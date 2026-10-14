/**
 * Browser Push Notification Service
 * Integrates Web Notifications API (HTML5 Notification)
 * with graceful in-app fallback, sound chime using Web Audio API,
 * and event dispatching.
 */

export interface BrowserPushPayload {
  id: string;
  title: string;
  body: string;
  type: 'application' | 'interview' | 'payment';
  timestamp: string;
  icon?: string;
  actionUrl?: string;
  actionText?: string;
  onAction?: () => void;
}

// Play pleasant notification chime using Web Audio API (no external file dependency)
export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Chime note 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Chime note 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch (err) {
    // Audio context may be restricted before user gesture
  }
}

// Request permission for Web Notifications API
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    // Legacy callback fallback
    return new Promise((resolve) => {
      Notification.requestPermission((result) => {
        resolve(result);
      });
    });
  }
}

// Send standard native browser push notification
export function dispatchBrowserNotification(
  title: string,
  options: {
    body: string;
    icon?: string;
    tag?: string;
    onClick?: () => void;
  }
): boolean {
  playNotificationSound();

  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          tag: options.tag || 'tawtheefx-notification',
          badge: options.icon || '/favicon.ico',
          dir: 'rtl',
          lang: 'ar',
        });

        if (options.onClick) {
          notif.onclick = () => {
            window.focus();
            options.onClick!();
            notif.close();
          };
        }
        return true;
      } catch (err) {
        // Native notification can fail in some sandboxed iframes
        return false;
      }
    }
  }
  return false;
}
