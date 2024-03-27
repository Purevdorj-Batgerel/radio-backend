import { opendir } from 'fs/promises'
import path from 'path'

export default async function* walk(dir) {
  for await (const d of await opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) yield* await walk(entry)
    else if (d.isFile()) yield entry
  }
}
