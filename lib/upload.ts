/**
 * Upload validation and constraints
 */

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  RATE_LIMIT_PER_MINUTE: 20,
}

export function validateUploadFile(file: File): { ok: boolean; error?: string } {
  if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      ok: false,
      error: `File too large. Max ${UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB allowed.`,
    }
  }

  if (!UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: `File type not allowed. Use: JPG, PNG, WebP, or GIF.`,
    }
  }

  return { ok: true }
}
