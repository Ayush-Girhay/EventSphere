import {
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";


function UploadMedia() {
  const [images, setImages] =
    useState([]);

  const [previews, setPreviews] =
    useState([]);

  const [visibility, setVisibility] =
  useState("public");

  const [imageTitle, setImageTitle] =
  useState("");

  const [users, setUsers] =
  useState([]);

  const [
  taggedUsers,
  setTaggedUsers,
] = useState([]);

const fetchUsers =
  async () => {
    try {
      const res =
        await axios.get(
          "https://eventsphere-mkp6.onrender.com/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

      setUsers(
        res.data.users
      );
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  fetchUsers();
}, []);

useEffect(() => {
  fetchUsers();
}, []);

    


  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);

    const previewUrls =
      acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setPreviews(previewUrls);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  const uploadImages = async () => {
    if (images.length === 0) {
      alert(
        "Please select images first"
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData =
      new FormData();

    images.forEach((image) => {
      formData.append(
        "images",
        image
      );
    });

    formData.append(
      "visibility",
      visibility
    );

    formData.append(
        "title",
        imageTitle
        );

        formData.append(
  "taggedUsers",
  JSON.stringify(
    taggedUsers
  )
);


    try {
      console.log(
  "TAGGED USERS =",
  taggedUsers
);

      await axios.post(
        "https://eventsphere-mkp6.onrender.com/api/media/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Images Uploaded Successfully"
      );

      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Upload Failed"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6">
  📤 Upload Media
</h1>

<div className="mb-6">
  <label className="block mb-2 font-semibold">
    Image Title
  </label>

  <input
    type="text"
    value={imageTitle}
    onChange={(e) =>
      setImageTitle(
        e.target.value
      )
    }
    placeholder="Enter image title"
    className="
      w-full
      bg-slate-700
      p-3
      rounded-lg
    "
  />
</div>

<div className="mb-6">
  <label className="block mb-2 font-semibold">
    🏷 Tag Users
  </label>

  <select
    multiple
    className="
      w-full
      bg-slate-700
      p-3
      rounded-lg
    "
    onChange={(e) =>
      setTaggedUsers(
        [...e.target.selectedOptions]
          .map(
            (option) =>
              option.value
          )
      )
    }
  >
   {users.map((user) => (
  <option
    key={user._id}
    value={user._id}
  >
    {user.name}
  </option>
))}
  </select>

  <p className="text-sm text-slate-400 mt-2">
    Hold Ctrl to select multiple users
  </p>
</div>

<div className="mb-6">
  <label className="block mb-2 font-semibold">
    Visibility
  </label>

  <select
    value={visibility}
    onChange={(e) =>
      setVisibility(
        e.target.value
      )
    }
    className="bg-slate-700 p-3 rounded-lg"
  >
            <option value="public">
              Public
            </option>

            <option value="private">
              Private
            </option>
          </select>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
            isDragActive
              ? "border-cyan-400 bg-slate-700"
              : "border-slate-600"
          }`}
        >
          <input
            {...getInputProps()}
          />

          {isDragActive ? (
            <p className="text-xl">
              Drop images here...
            </p>
          ) : (
            <>
              <p className="text-xl font-semibold">
                Drag & Drop Images
              </p>

              <p className="text-slate-400 mt-2">
                or click to browse
              </p>
            </>
          )}
        </div>

        {previews.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              Preview
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map(
                (
                  preview,
                  index
                ) => (
                  <img
                    key={index}
                    src={preview}
                    alt="preview"
                    className="w-full h-56 object-cover rounded-xl"
                  />
                )
              )}
            </div>
          </>
        )}

        <button
          onClick={uploadImages}
          className="mt-8 bg-cyan-600 hover:bg-cyan-700 px-8 py-3 rounded-xl font-semibold"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
}

export default UploadMedia;