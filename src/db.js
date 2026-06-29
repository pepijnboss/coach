// Persistence layer.
//
// Default adapter: a small, dependency-free JSON document store backed by a
// file on disk. Writes are atomic (write-to-temp + rename) and serialised
// through an in-process queue so concurrent requests never corrupt the file.
//
// This is intentionally behind a tiny interface (read/write/update) so it can
// be swapped for Supabase/Postgres later without touching the service layer.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { ROOT_DIR } from './config.js';

const DATA_DIR = path.join(ROOT_DIR, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonCollection {
  /**
   * @param {string} name  file name without extension, e.g. "leads"
   * @param {object} initial  default document when the file does not exist
   */
  constructor(name, initial = { items: [] }) {
    ensureDataDir();
    this.file = path.join(DATA_DIR, `${name}.json`);
    this.initial = initial;
    // Promise chain that serialises all writes to this collection.
    this._queue = Promise.resolve();
  }

  async read() {
    try {
      const raw = await fsp.readFile(this.file, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === 'ENOENT') return structuredClone(this.initial);
      // Corrupt file: back it up and start fresh rather than crash the server.
      if (err instanceof SyntaxError) {
        const backup = `${this.file}.corrupt-${Date.now()}`;
        try {
          await fsp.rename(this.file, backup);
        } catch {
          /* ignore */
        }
        return structuredClone(this.initial);
      }
      throw err;
    }
  }

  async _writeAtomic(doc) {
    ensureDataDir();
    const tmp = `${this.file}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(doc, null, 2), 'utf8');
    await fsp.rename(tmp, this.file);
  }

  /**
   * Run a mutator against the current document under an exclusive lock.
   * The mutator receives the document, may mutate it, and returns any value
   * which is then returned to the caller after the write succeeds.
   */
  update(mutator) {
    const run = async () => {
      const doc = await this.read();
      const result = await mutator(doc);
      await this._writeAtomic(doc);
      return result;
    };
    // Chain onto the queue; swallow rejection in the chain so one failed write
    // does not poison subsequent writes, but still surface it to this caller.
    const next = this._queue.then(run, run);
    this._queue = next.catch(() => {});
    return next;
  }
}

export default JsonCollection;
