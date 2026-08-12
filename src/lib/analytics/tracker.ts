// CYBERVERSE — Analytics Tracker
// Lightweight event tracking (pluggable — swap for Posthog/Plausible in prod)

type EventCategory = 'navigation' | 'interaction' | 'completion' | 'achievement' | 'error';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private sessionStart = Date.now();
  private enabled = true;

  track(category: EventCategory, action: string, label?: string, value?: number) {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: Date.now() - this.sessionStart,
    };

    this.events.push(event);

    // Console in dev (replace with API call in prod)
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[CYBERVERSE] ${category}/${action}${label ? `: ${label}` : ''}${value !== undefined ? ` (${value})` : ''}`);
    }
  }

  // Convenience methods
  pageView(screen: string) { this.track('navigation', 'page_view', screen); }
  locationEntered(location: string) { this.track('navigation', 'location_enter', location); }
  locationCompleted(location: string) { this.track('completion', 'location_complete', location); }
  simulationStarted(sim: string) { this.track('interaction', 'sim_start', sim); }
  simulationCompleted(sim: string, score?: number) { this.track('completion', 'sim_complete', sim, score); }
  achievementUnlocked(achievement: string) { this.track('achievement', 'unlock', achievement); }
  interactionClicked(element: string) { this.track('interaction', 'click', element); }
  errorOccurred(error: string) { this.track('error', 'runtime', error); }

  // Get session summary
  getSummary() {
    const duration = Date.now() - this.sessionStart;
    return {
      sessionDuration: duration,
      totalEvents: this.events.length,
      completions: this.events.filter(e => e.category === 'completion').length,
      interactions: this.events.filter(e => e.category === 'interaction').length,
      locationsVisited: new Set(this.events.filter(e => e.action === 'location_enter').map(e => e.label)).size,
    };
  }

  // Export for debugging
  exportEvents() { return [...this.events]; }

  setEnabled(v: boolean) { this.enabled = v; }
}

export const analytics = new AnalyticsTracker();
