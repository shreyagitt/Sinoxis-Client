import cloudinary from "../config/cloudinary";

interface UploadResult {
  url: string;
  public_id: string;
  resource_type: string;
}

/**
 * Upload media files to Cloudinary
 */
export const uploadMedia = async (files: Express.Multer.File[]): Promise<UploadResult[]> => {
  const uploadResults: UploadResult[] = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "sinoxis_media",
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    });

    uploadResults.push({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  }

  return uploadResults;
};

/**
 * Fetch all media from Cloudinary
 */
export const listMedia = async () => {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "sinoxis_media/",
    max_results: 30,
  });

  return result.resources.map((r: any) => ({
    public_id: r.public_id,
    url: r.secure_url,
    format: r.format,
    resource_type: r.resource_type,
  }));
};

/**
 * Delete media by public_id
 */
export const deleteMedia = async (public_id: string) => {
  return await cloudinary.uploader.destroy(public_id, { resource_type: "auto" });
};
