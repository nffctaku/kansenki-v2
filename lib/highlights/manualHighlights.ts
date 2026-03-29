export type ManualHighlight = {
  id: string;
  label: string;
  youtubeVideoId: string;
  competitionId?: 'PL' | 'CL' | 'EL' | 'FA' | 'CARABAO' | 'OTHER';
};

export const manualHighlights: ManualHighlight[] = [
  {
    id: 'pl-md31-VMrn7nf5rj4',
    label: '31節',
    youtubeVideoId: 'VMrn7nf5rj4',
    competitionId: 'PL',
  },
  {
    id: 'el-highlight-hOEo9kLiqCE',
    label: 'EL',
    youtubeVideoId: 'hOEo9kLiqCE',
    competitionId: 'EL',
  },
  {
    id: 'pl-md30-IAkmALikvSY',
    label: '30節',
    youtubeVideoId: 'IAkmALikvSY',
    competitionId: 'PL',
  },
  {
    id: 'el-highlight-FVzAayeP9J0',
    label: 'EL',
    youtubeVideoId: 'FVzAayeP9J0',
    competitionId: 'EL',
  },
];
