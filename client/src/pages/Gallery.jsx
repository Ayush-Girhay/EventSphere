import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

function Gallery() {
  const [media, setMedia] = useState([]);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] =
    useState(null);
    const [similarPhotos,
setSimilarPhotos] =
useState([]);

  const role = localStorage.getItem("role");

  const fetchMedia = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/media"
      );

      let mediaData = res.data.mediaFiles;

      if (role === "Viewer") {
        mediaData = mediaData.filter(
          (item) =>
            item.visibility === "public"
        );
      }

      setMedia(mediaData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  fetchMedia();


  socket.on(
  "mediaDeleted",
  () => {
    fetchMedia();
  }
    );


  socket.on(
    "mediaLiked",
    () => {
      fetchMedia();
    }
  );

  socket.on(
    "commentAdded",
    () => {
      fetchMedia();
    }
  );

  return () => {
    socket.off(
      "mediaLiked"
    );

    socket.off(
      "commentAdded"
    );
  };
}, []);

 

    const likeImage = async (id) => {
  try {
    await axios.post(
      `http://localhost:5000/api/media/like/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    );

    fetchMedia();
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Like failed"
    );
  }
};

const searchMedia = async (
  value
) => {
  try {
    setSearch(value);

    if (!value.trim()) {
      fetchMedia();
      return;
    }

    const res =
      await axios.get(
        `http://localhost:5000/api/media/search?search=${value}`
      );

    setMedia(
      res.data.media
    );
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        🖼 Gallery
      </h1>

      <input
  type="text"
  placeholder="🔍 Search by filename or tag..."
  value={search}
  onChange={(e) =>
    searchMedia(
      e.target.value
    )
  }
  className="w-full md:w-96 p-3 rounded-lg bg-slate-800 border border-slate-700"
/>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {media.map((item) => (
          <div
            key={item._id}
            className="bg-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            <img
  src={
    item.url
      ? item.url
      : `http://localhost:5000/uploads/${item.filename}`
  }
  alt=""
  className="w-full h-60 object-cover cursor-pointer"
  
  
  onClick={async () => {
  setSelectedImage(item);

  const res =
    await axios.get(
      `http://localhost:5000/api/media/similar/${item._id}`
    );

  setSimilarPhotos(
    res.data.similar
  );
}}
/>

            <div className="p-4">
              <p className="font-semibold truncate">
                {item.title ||
            item.filename}
              </p>

              <p className="text-sm text-slate-400 mt-2 italic">
            {item.caption}
            </p>

              <div className="flex flex-wrap gap-2 mt-2">
  {item.tags?.map(
    (tag, index) => (
      <span
        key={index}
        className="
          bg-cyan-700
          text-xs
          px-2
          py-1
          rounded-full
        "
      >
        #{tag}
      </span>
    )
  )}
</div>

            <p className="text-xs text-cyan-400 mt-2">
                Uploaded by:
                {" "}
                {item.uploadedBy?.name ||
                    "Unknown"}
                </p>

              <p className="text-sm text-slate-400 mt-1">
                {item.visibility ===
                "private"
                  ? "🔒 Private"
                  : "🌍 Public"}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
              
              
                <button
                        className="bg-pink-600 px-3 py-2 rounded"
                        onClick={() =>
                            likeImage(item._id)
                        }
                        >
                        ❤️ {item.likes}
                        </button>

            

                <button
  className="bg-yellow-600 px-3 py-2 rounded"
  onClick={async () => {
  try {
    await axios.post(
      `http://localhost:5000/api/media/favorite/${item._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchMedia();
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Favorite failed"
    );
  }
}}
>
  ⭐ {item.favorites}
</button>

                {role !== "Viewer" && (
                  <button
                    className="bg-red-600 px-3 py-2 rounded"
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:5000/api/media/${item._id}`
                      );

                      fetchMedia();
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
  className="bg-slate-900 p-6 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
           <img
                src={
                    selectedImage.url
                    ? selectedImage.url
                    : `http://localhost:5000/uploads/${selectedImage.filename}`
                }
                alt=""
                className="max-h-[70vh] w-auto mx-auto rounded-xl object-contain"
            />

            <div className="mt-4 space-y-2">
              <h2 className="text-2xl font-bold">
                {selectedImage.filename}
              </h2>

              <p>
                Visibility:
                {" "}
                {
                  selectedImage.visibility
                }
              </p>

              <p>
                ❤️
                {" "}
                {selectedImage.likes}
              </p>

              <p>
                ⭐
                {" "}
                {
                  selectedImage.favorites
                }
              </p>

              <div className="flex gap-3 mt-4">
               
               
                <a
  href={
    selectedImage.url
      ? selectedImage.url
      : `http://localhost:5000/uploads/${selectedImage.filename}`
  }
  download
  className="bg-cyan-600 px-4 py-2 rounded"
>
  Download
</a>

                <button
                  className="bg-slate-700 px-4 py-2 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(
  selectedImage.url
    ? selectedImage.url
    : `http://localhost:5000/uploads/${selectedImage.filename}`
);
                  }}
                >
                  Share
                </button>
              </div>

<div className="mt-6">
  <h3 className="text-xl font-bold">
    🤖 Similar Photos
  </h3>

  <div className="grid grid-cols-2 gap-4 mt-3">
    {similarPhotos.map(
      (photo) => (
        <img
          key={photo._id}
          src={photo.url}
          alt=""
          className="
            rounded-lg
            h-32
            object-cover
            w-full
          "
        />
      )
    )}
  </div>
</div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">
                  Comments
                </h3>

                {selectedImage.comments?.map(
                  (
                    comment,
                    index
                  ) => (
                    <div
                      key={index}
                      className="bg-slate-800 p-2 rounded mb-2"
                    >
                      💬 {comment}
                    </div>
                  )
                )}

                <div className="flex gap-2 mt-4">
                  <input
                    value={comment}
                    onChange={(e) =>
                      setComment(
                        e.target.value
                      )
                    }
                    placeholder="Write comment..."
                    className="flex-1 p-3 rounded bg-slate-800"
                  />

                  <button
                    className="bg-cyan-600 px-4 rounded"
                    
                    onClick={async () => {
                      await axios.post(
                        `http://localhost:5000/api/media/comment/${selectedImage._id}`,
                        {
                          text: comment,
                        }
                      );

                      setComment("");

                      const updated =
                        await axios.get(
                          "http://localhost:5000/api/media"
                        );

                      const current =
                        updated.data.mediaFiles.find(
                          (
                            m
                          ) =>
                            m._id ===
                            selectedImage._id
                        );

                      setSelectedImage(
                        current
                      );

                      fetchMedia();
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                className="mt-6 bg-red-600 px-4 py-2 rounded"
                onClick={() =>
                  setSelectedImage(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;