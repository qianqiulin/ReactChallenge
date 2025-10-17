// src/utils/courseSchema.ts
import { z } from 'zod';

// Day tokens (2-letter prioritized first so Tu/Th don't collide)
const dayToken = '(?:Tu|Th|Sa|Su|M|W|F)';
const daysGroup = `(?:${dayToken})+`;

// HH:MM 24-hour
const hhmm = '(?:[01]?\\d|2[0-3]):[0-5]\\d';
const timeRange = `${hhmm}-${hhmm}`;

// "MWF 09:00-09:50" or "TuTh 14:00-15:20"
export const meetingRegex = new RegExp(`^${daysGroup}\\s+${timeRange}$`);

function parseHHMM(s: string): number | null {
  const m = s.match(/^(\d{1,2}):([0-5]\d)$/);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h < 0 || h > 23) return null;
  return h * 60 + min;
}

const allowedTerms = ['Fall', 'Winter', 'Spring', 'Summer'] as const;

export const CourseZ = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),

  term: z
    .string()
    .refine((v): v is typeof allowedTerms[number] => allowedTerms.includes(v as any), {
      message: 'Term must be Fall, Winter, Spring, or Summer',
    }),

  number: z
    .string()
    .regex(/^\d+(?:-\d+)?$/, 'Number must be digits with optional section, e.g., "213" or "213-2"'),

  meets: z
    .string()
    .refine(
      (s) => s === '' || meetingRegex.test(s),
      {
        message:
          'Must be empty or like "MWF 12:00-13:20" or "TuTh 14:00-15:20" (one or more days + start-end)',
      }
    )
    .superRefine((s, ctx) => {
      if (!s || !meetingRegex.test(s)) return; // format handled above
      const [, timeStr] = s.trim().split(/\s+/, 2);
      const [startStr, endStr] = (timeStr ?? '').split('-');
      const start = parseHHMM(startStr ?? '');
      const end = parseHHMM(endStr ?? '');
      if (start == null || end == null) return;
      if (!(start < end)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time must be earlier than end time',
        });
      }
    }),
});

export type CourseFormData = z.infer<typeof CourseZ>;
