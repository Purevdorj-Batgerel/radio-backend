import { opendir, unlink } from 'fs/promises'
import path from 'path'

export async function* walk(dir) {
  for await (const d of await opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) yield* await walk(entry)
    else if (d.isFile()) yield entry
  }
}

export async function emptyDir(dir, keepExtension) {
  for await (const file of walk(dir)) {
    if (keepExtension && !file.endsWith(keepExtension)) {
      await unlink(file)
    }
  }
}
