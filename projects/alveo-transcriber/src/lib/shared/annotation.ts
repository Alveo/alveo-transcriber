export const ANNOTATION_CSV_FIELDS = [
  'id',
  'start',
  'end',
  'speaker',
  'caption',
  'cap_type'
];

export class Annotation {
  id: string;
  start: number;
  end: number;
  speaker: string;
  caption: string;
  cap_type: string;

  cap_options: Array<string>;

  constructor(id: string,
              start: number= 0, end: number= 0,
              speaker: string= '', caption: string= '',
              cap_type: string= 'text') {
    this.id = id;
    this.start = start;
    this.end = end;
    this.speaker = speaker;
    this.caption = caption;
    this.cap_type = cap_type;

    this.cap_options = [
      'text', 'noise'
    ];
  }
}

