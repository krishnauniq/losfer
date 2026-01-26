export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "losfer_unsigned"); // your preset name
  data.append("cloud_name", "dk55dfbb2");    // from dashboard

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dk55dfbb2/image/upload`,
    {
      method: "POST",
      body: data
    }
  );

  const result = await res.json();
  return result.secure_url;
};
