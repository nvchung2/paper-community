import { MutationConfig } from "lib/react-query";
import { useMutation } from "react-query";
import axios from "axios";

async function uploadImage(img: File): Promise<{ url: string }> {
  const data = new FormData();
  data.append("file", img);
  data.append("upload_preset", "paper_blog_images");
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dewymokti/image/upload",
    data
  );
  return res.data;
}
export function useUploadImage(config?: MutationConfig<typeof uploadImage>) {
  return useMutation({
    mutationFn: uploadImage,
    ...config,
  });
}
