export type LabExperiment = {
  id: string;
  title: string;
  status: "active" | "wip" | "queued";
  note: string;
};

export const labExperiments: LabExperiment[] = [
  {
    id: "market",
    title: "Market analytics engine",
    status: "active",
    note: "Streaming price analysis with indicator computation on every tick.",
  },
  {
    id: "network",
    title: "Service dependency graph",
    status: "active",
    note: "Live topology of services, health and call volume between nodes.",
  },
  {
    id: "backtest",
    title: "Backtest metrics",
    status: "wip",
    note: "Strategy evaluation harness: returns, drawdown, exposure, win rate.",
  },
  {
    id: "pipeline",
    title: "Automation pipeline",
    status: "queued",
    note: "Scheduled jobs for data collection, reporting and alerting.",
  },
];

export const codeSample = `// risk guard — evaluated before every order
func (r *Guard) Allow(o Order) Decision {
  if r.exposure(o) > r.maxExposure {
    return Reject("position limit")
  }
  if r.dayLoss() > r.circuitBreaker {
    return Flatten("daily loss breached")
  }
  return Approve(o)
}`;
