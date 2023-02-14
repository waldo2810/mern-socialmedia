import axios from "axios";

//first upload the image to imgbb
export const uploadImage = (img, apiKey) => {
  let body = new FormData();
  body.set("key", apiKey);
  body.append("image", img);

  return axios({
    method: "post",
    url: "https://api.imgbb.com/1/upload",
    data: body,
  });
};
