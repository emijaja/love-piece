import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const ALLOWED_FILES = new Set([
  'yuujin.mp3',
  'koibito.mp3',
  'kyodai.mp3',
  'ryosin.mp3',
  'sohubo.mp3',
  'kekkon.mp3',
  'kodomo.mp3',
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: { file: string } }
) {
  const fileName = params.file;

  if (!ALLOWED_FILES.has(fileName)) {
    return new Response('Not Found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'bgm', fileName);

  try {
    const data = await readFile(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to read BGM file:', error);
    return new Response('Not Found', { status: 404 });
  }
}
