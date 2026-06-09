import {
  useEffect,
  useState,
} from "react";
import axios from "axios";

function MyTaggedPhotos() {
  const [photos, setPhotos] =
    useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos =
    async () => {
      const res =
        await axios.get(
          "https://eventsphere-mkp6.onrender.com/api/media/tagged",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

      setPhotos(
        res.data.photos
      );
    };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        👤 My Tagged Photos
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {photos.map(
          (photo) => (
            <img
              key={photo._id}
              src={photo.url}
              alt=""
              className="
                rounded-xl
                h-64
                w-full
                object-cover
              "
            />
          )
        )}
      </div>
    </div>
  );
}

export default MyTaggedPhotos;