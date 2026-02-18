import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUESTIONS_DIR = path.join(__dirname, '../src/data/questions');

const REMOVE_QUALS = [
    'C2', 'C3', 'D1', 'D2', 'D3', 'E1', 'E2', 'F3', 'F5'
];

console.log('Starting cleanup...');

for (const qid of REMOVE_QUALS) {
    const dir = path.join(QUESTIONS_DIR, qid);
    if (fs.existsSync(dir)) {
        try {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`Assuming removed: ${dir}`);
            // rmSync is synchronous, so it should be done.
        } catch (e) {
            console.error(`Failed to remove ${dir}: ${e.message}`);
        }
    } else {
        console.log(`Directory not found (already removed?): ${dir}`);
    }
}
console.log('Cleanup complete.');
