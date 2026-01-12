export type FollowUpPlanStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

export interface FollowUpPlanDto {
  id: string;
  firstDueAt: string; // ISO DateTime string
  rrule: string;
  status: FollowUpPlanStatus;
  notes: string | null;
  createdAt: string | null;
  patientDto: {
    id: string;
    healthInsuranceId: string;
    bloodType: string;
    allergies: string;
    createdAt: string;
    userDto: {
      id: string;
      email: string;
      fullName: string;
      address: string | null;
      citizenId: string;
      phone: string;
      gender: boolean;
      birthDate: string;
      avatarUrl: string | null;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
    };
  };
  doctorDto: {
    id: string;
    licenseId: string;
    isVerified: boolean;
    createdAt: string;
    staffDto: {
      id: string;
      position: string;
      createdAt: string;
      userDto: {
        id: string;
        email: string;
        fullName: string;
        address: string | null;
        citizenId: string;
        phone: string;
        gender: boolean;
        birthDate: string;
        avatarUrl: string | null;
        createdAt: string;
        updatedAt: string;
        isActive: boolean;
      };
      departmentDto: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
      } | null;
    };
  };
  baseEncounterDto: {
    id: string;
    type: string;
    startedAt: string;
    endedAt: string | null;
    diagnosis: string;
    notes: string;
    createdAt: string;
  };
}

export interface FollowUpPlanRequestDto {
  firstDueAt: string; // format: yyyy-MM-dd'T'HH:mm
  rrule: string;
  status?: FollowUpPlanStatus;
  notes?: string;
  patientId: string;
  doctorId: string;
  baseEncounterId?: string;
}

export interface RRuleOption {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  count: number;
  interval?: number;
}

// Helper to build RRULE string
export function buildRRule(option: RRuleOption): string {
  const parts = [`FREQ=${option.freq}`, `COUNT=${option.count}`];
  if (option.interval && option.interval > 1) {
    parts.push(`INTERVAL=${option.interval}`);
  }
  return parts.join(";");
}

// Helper to parse RRULE string
export function parseRRule(rrule: string): RRuleOption | null {
  try {
    const parts = rrule.split(";");
    const result: Partial<RRuleOption> = { interval: 1 };

    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key === "FREQ") result.freq = value as RRuleOption["freq"];
      if (key === "COUNT") result.count = parseInt(value);
      if (key === "INTERVAL") result.interval = parseInt(value);
    });

    if (result.freq && result.count) {
      return result as RRuleOption;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper to get human-readable text from RRULE
export function getRRuleText(rrule: string): string {
  const parsed = parseRRule(rrule);
  if (!parsed) return rrule;

  const freqText: Record<RRuleOption["freq"], string> = {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    YEARLY: "year",
  };

  const interval = parsed.interval || 1;
  const freq = freqText[parsed.freq];
  const pluralFreq = parsed.count > 1 || interval > 1 ? freq + "s" : freq;

  if (interval > 1) {
    return `Every ${interval} ${pluralFreq}, ${parsed.count} times`;
  }
  return `Every ${freq}, ${parsed.count} times`;
}

// Helper to calculate next appointment dates
export function calculateNextDates(
  firstDueAt: string,
  rrule: string
): Date[] {
  const parsed = parseRRule(rrule);
  if (!parsed) return [];

  const dates: Date[] = [];
  const current = new Date(firstDueAt);
  const interval = parsed.interval || 1;

  for (let i = 0; i < parsed.count; i++) {
    dates.push(new Date(current));

    // Calculate next date based on frequency
    switch (parsed.freq) {
      case "DAILY":
        current.setDate(current.getDate() + interval);
        break;
      case "WEEKLY":
        current.setDate(current.getDate() + 7 * interval);
        break;
      case "MONTHLY":
        current.setMonth(current.getMonth() + interval);
        break;
      case "YEARLY":
        current.setFullYear(current.getFullYear() + interval);
        break;
    }
  }

  return dates;
}
