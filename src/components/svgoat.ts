import { extractDimensions } from '../lib/dimensions';
import { optimizeErrorMessage } from '../lib/errors';
import { runOptimization } from '../lib/optimize';
import { buildStatsLine } from '../lib/stats';
import { isLikelySvg } from '../lib/validate';

const LARGE_FILE_BYTES = 2 * 1024 * 1024;
const COPY_RESET_MS = 2500;

type Phase = 'idle' | 'optimizing' | 'success';

type SvgoatComponent = {
  phase: Phase;
  error: string | null;
  warning: string | null;
  statsLine: string;
  previewMarkup: string;
  optimizedOutput: string;
  copyLabel: string;
  isDragging: boolean;
  readonly hasResult: boolean;
  readonly isOptimizing: boolean;
  readonly showResult: boolean;
  init: () => void;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent) => void;
  onFileSelected: (event: Event) => void;
  processFile: (file: File) => Promise<void>;
  processText: (source: string, fileSizeBytes?: number) => Promise<void>;
  setError: (message: string) => void;
  markCopied: () => void;
  copy: () => Promise<void>;
};

const isSvgFile = (file: File): boolean =>
  file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml';

const largeFileWarning = (fileSizeBytes: number | undefined): string | null =>
  fileSizeBytes !== undefined && fileSizeBytes >= LARGE_FILE_BYTES
    ? 'This file is large; optimization may take a moment.'
    : null;

const yieldToPaint = (): Promise<void> =>
  new Promise(resolve => {
    requestAnimationFrame(() => resolve());
  });

const hasTextSelection = (): boolean => {
  const selection = window.getSelection();
  return Boolean(selection?.toString().trim());
};

/**
 * Alpine.js component: dropzone, optimization, stats, preview, and copy.
 *
 * @returns Alpine component state and methods.
 */
export const svgoat = (): SvgoatComponent => {
  let runId = 0;
  let copyTimeout: ReturnType<typeof setTimeout> | undefined;

  return {
    phase: 'idle',
    error: null,
    warning: null,
    statsLine: '',
    previewMarkup: '',
    optimizedOutput: '',
    copyLabel: 'Copy',
    isDragging: false,

    get hasResult() {
      return this.phase === 'success';
    },

    get isOptimizing() {
      return this.phase === 'optimizing';
    },

    get showResult() {
      return this.phase === 'success' || this.phase === 'optimizing';
    },

    init() {
      document.addEventListener('paste', (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData('text/plain');
        if (!text) {
          return;
        }
        event.preventDefault();
        void this.processText(text);
      });

      document.addEventListener('copy', (event: ClipboardEvent) => {
        if (this.phase !== 'success' || !this.optimizedOutput || hasTextSelection()) {
          return;
        }

        event.preventDefault();
        event.clipboardData?.setData('text/plain', this.optimizedOutput);
        this.markCopied();
      });
    },

    markCopied() {
      this.copyLabel = 'Copied!';
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        this.copyLabel = 'Copy';
      }, COPY_RESET_MS);
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
      this.isDragging = true;
    },

    onDragLeave() {
      this.isDragging = false;
    },

    onDrop(event: DragEvent) {
      event.preventDefault();
      this.isDragging = false;
      const file = event.dataTransfer?.files[0];
      if (file) {
        void this.processFile(file);
      }
    },

    onFileSelected(event: Event) {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      const file = event.target.files?.[0];
      if (file) {
        void this.processFile(file);
      }
      event.target.value = '';
    },

    async processFile(file: File) {
      if (!isSvgFile(file)) {
        this.setError('Please drop an SVG file.');
        return;
      }

      const text = await file.text();
      void this.processText(text, file.size);
    },

    async processText(source: string, fileSizeBytes?: number) {
      const trimmed = source.trim();
      if (!trimmed) {
        return;
      }

      if (!isLikelySvg(trimmed)) {
        this.setError('This content is not valid SVG markup.');
        return;
      }

      const currentRun = ++runId;
      this.error = null;
      this.warning = largeFileWarning(fileSizeBytes);
      this.phase = 'optimizing';
      this.statsLine = '';
      this.previewMarkup = '';

      await yieldToPaint();

      if (currentRun !== runId) {
        return;
      }

      const dimensions = extractDimensions(trimmed);
      const result = runOptimization(trimmed);

      if (currentRun !== runId) {
        return;
      }

      if (!result.ok) {
        this.setError(optimizeErrorMessage(result.reason));
        return;
      }

      this.optimizedOutput = result.data;
      this.previewMarkup = result.data;
      this.statsLine = buildStatsLine(trimmed, result.data, dimensions);
      this.phase = 'success';
    },

    setError(message: string) {
      this.phase = 'idle';
      this.error = message;
      this.warning = null;
      this.statsLine = '';
      this.previewMarkup = '';
      this.optimizedOutput = '';
    },

    async copy() {
      if (!this.optimizedOutput) {
        return;
      }

      try {
        await navigator.clipboard.writeText(this.optimizedOutput);
        this.markCopied();
      } catch {
        this.error = 'Could not copy to clipboard. Check browser permissions.';
      }
    },
  };
};
